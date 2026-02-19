// 한국사 키워드 카드 생성 앱
(function () {
  'use strict';

  const STORAGE = {
    stats: 'history_stats_v1',
    training: 'history_training_v1',
    lastSet: 'history_last_set_v1',
    retryCards: 'history_retry_cards_v1',
    streak: 'history_streak_v1'
  };

  const IMP_WEIGHT = { S: 1.0, A: 0.82, B: 0.64 };
  const TYPE_STRENGTH = { after: 0.86, between: 1.0, sameEra: 0.8, cause: 0.92 };
  const TYPE_LABEL = {
    after: '이후/이전형',
    between: '사이/연표형',
    sameEra: '동시기형',
    cause: '원인-결과형'
  };

  const STATE = {
    currentPage: 'dashboard',
    events: Array.isArray(HISTORY_EVENTS) ? HISTORY_EVENTS : [],
    eventByName: new Map(),
    keywordLexicon: new Map(),
    keywordGrade: new Map(),
    keywordLabel: new Map(),
    recommendedKeywords: [],
    generatedCards: [],

    drillCards: [],
    drillIndex: 0,
    drillAnswers: {},
    drillResponseSec: {},
    drillStartTs: 0,
    activeCardId: null,
    pressureTickerId: null,
    drillPressureBudgetSec: 0,

    training: {
      speedMode: false,
      strictCore: true
    },

    retryCards: [],
    retryIndexById: new Map()
  };

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeText(value) {
    return String(value || '').replace(/\s+/g, '').toLowerCase();
  }

  function normalizeSpace(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function weightedPick(weightedRows) {
    const rows = weightedRows.filter(r => r.weight > 0);
    if (!rows.length) return null;
    const total = rows.reduce((s, r) => s + r.weight, 0);
    let point = Math.random() * total;
    for (const row of rows) {
      point -= row.weight;
      if (point <= 0) return row.value;
    }
    return rows[rows.length - 1].value;
  }

  function gradeByScore(score) {
    if (score >= 0.86) return 'S';
    if (score >= 0.72) return 'A';
    return 'B';
  }

  function getElapsedSec(startTs) {
    if (!startTs) return 0;
    return Number(Math.max(0, (performance.now() - startTs) / 1000).toFixed(1));
  }

  function calcDday() {
    const exam = new Date(HISTORY_EXAM_DATE);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    exam.setHours(0, 0, 0, 0);
    return Math.ceil((exam - now) / 86400000);
  }

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function loadStats() {
    return loadJson(STORAGE.stats, {
      attempts: 0,
      correct: 0,
      totalSec: 0,
      setsCreated: 0,
      daily: { date: '', count: 0 },
      tagCounts: {}
    });
  }

  function saveStats(stats) {
    saveJson(STORAGE.stats, stats);
  }

  function loadTraining() {
    return loadJson(STORAGE.training, { speedMode: false, strictCore: true });
  }

  function saveTraining(training) {
    saveJson(STORAGE.training, training);
  }

  function loadRetryCards() {
    return loadJson(STORAGE.retryCards, []);
  }

  function saveRetryCards(rows) {
    saveJson(STORAGE.retryCards, rows.slice(0, 120));
  }

  function loadLastSet() {
    return loadJson(STORAGE.lastSet, []);
  }

  function saveLastSet(rows) {
    saveJson(STORAGE.lastSet, rows.slice(0, 60));
  }

  function loadStreak() {
    return loadJson(STORAGE.streak, { count: 0, lastDate: '' });
  }

  function saveStreak(streak) {
    saveJson(STORAGE.streak, streak);
  }

  function logJournalAttempt(payload) {
    if (!window.StudyJournal || typeof window.StudyJournal.logAttempt !== 'function') return null;
    return window.StudyJournal.logAttempt(payload);
  }

  function updateStreak() {
    const s = loadStreak();
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (s.lastDate === today) return s.count;
    if (s.lastDate === yesterday) {
      s.count += 1;
      s.lastDate = today;
    } else {
      s.count = 1;
      s.lastDate = today;
    }
    saveStreak(s);
    return s.count;
  }

  function prepareData() {
    STATE.eventByName = new Map(STATE.events.map(ev => [ev.name, ev]));

    const lexicon = new Map();
    const labelMap = new Map();
    STATE.events.forEach(ev => {
      const eventWeight = (IMP_WEIGHT[ev.importance] || 0.7) * 1.4;
      const fullName = normalizeText(ev.name);
      if (fullName) {
        lexicon.set(fullName, (lexicon.get(fullName) || 0) + eventWeight + 1.5);
        if (!labelMap.has(fullName)) labelMap.set(fullName, ev.name);
      }
      (ev.keywords || []).forEach(kw => {
        const key = normalizeText(kw);
        if (!key) return;
        lexicon.set(key, (lexicon.get(key) || 0) + eventWeight);
        if (!labelMap.has(key)) labelMap.set(key, kw);
      });
    });
    STATE.keywordLexicon = lexicon;

    const sourceSeeds = window.HISTORY_SOURCE_SEEDS || { keywordFreq: [], typeFreq: {} };
    const weighted = new Map();

    // Event-based prior
    lexicon.forEach((score, key) => {
      weighted.set(key, (weighted.get(key) || 0) + score);
    });

    // PDF-based prior (filtered by event lexicon)
    (sourceSeeds.keywordFreq || []).forEach(row => {
      const key = normalizeText(row.keyword);
      if (!key || !lexicon.has(key)) return;
      weighted.set(key, (weighted.get(key) || 0) + Number(row.count || 0) * 0.8);
      if (!labelMap.has(key)) labelMap.set(key, row.keyword);
    });

    const ranked = [...weighted.entries()].sort((a, b) => b[1] - a[1]);
    if (!ranked.length) return;

    const sCut = ranked[Math.max(Math.floor(ranked.length * 0.30) - 1, 0)]?.[1] || 0;
    const aCut = ranked[Math.max(Math.floor(ranked.length * 0.65) - 1, 0)]?.[1] || 0;

    const gradeMap = new Map();
    ranked.forEach(([kw, score], idx) => {
      let grade = 'B';
      if (score >= sCut) grade = 'S';
      else if (score >= aCut) grade = 'A';
      gradeMap.set(kw, { score, rank: idx + 1, grade });
    });

    STATE.keywordGrade = gradeMap;
    STATE.keywordLabel = labelMap;
    STATE.recommendedKeywords = ranked.slice(0, 24).map(([kw]) => kw);

    // retry cards load
    STATE.retryCards = loadRetryCards();
    STATE.retryIndexById = new Map(STATE.retryCards.map((c, i) => [c.id, i]));
  }

  function renderDday() {
    const d = calcDday();
    const el = document.getElementById('ddayBadge');
    if (!el) return;
    el.textContent = d > 0 ? `D-${d}` : d === 0 ? 'D-DAY!' : `D+${Math.abs(d)}`;
  }

  function setupSubjectSwitch() {
    const el = document.getElementById('subjectSwitch');
    if (!el) return;
    el.value = 'his';
    el.addEventListener('change', e => {
      const value = e.target.value;
      if (value === 'his') return;
      if (value === 'law') {
        window.location.href = 'index.html';
        return;
      }
      if (value === 'admin') {
        window.location.href = 'admin.html';
        return;
      }
      if (value === 'kor' || value === 'eng') {
        window.location.href = `lang.html?subject=${value}`;
      }
    });
  }

  function syncJournalLink() {
    const link = document.getElementById('journalLink');
    if (!link) return;
    link.href = 'journal.html?subject=his';
  }

  function setupNav() {
    const nav = document.getElementById('navTabs');
    nav.addEventListener('click', e => {
      const tab = e.target.closest('.nav-tab');
      if (!tab) return;
      switchPage(tab.dataset.page);
    });
  }

  function switchPage(page) {
    clearPressureTicker();
    if (page !== 'drill') hidePressureTimer();

    STATE.currentPage = page;
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.page === page));
    document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === `page-${page}`));

    if (page === 'dashboard') renderDashboard();
    if (page === 'guide') renderGuide();
  }

  function setupButtons() {
    document.getElementById('generateCardsBtn').addEventListener('click', handleGenerateCards);
    document.getElementById('startDrillBtn').addEventListener('click', () => startDrill(STATE.generatedCards));
    document.getElementById('startRetryDrill').addEventListener('click', startRetryDrill);
    document.getElementById('jumpToMaker').addEventListener('click', () => switchPage('maker'));
    document.getElementById('goMakerFromDrill').addEventListener('click', () => switchPage('maker'));

    document.getElementById('prevDrill').addEventListener('click', () => navDrill(-1));
    document.getElementById('nextDrill').addEventListener('click', () => navDrill(1));

    const speed = document.getElementById('speedModeToggle');
    const strict = document.getElementById('strictModeToggle');
    speed.checked = !!STATE.training.speedMode;
    strict.checked = !!STATE.training.strictCore;

    speed.addEventListener('change', () => {
      STATE.training.speedMode = !!speed.checked;
      saveTraining(STATE.training);
    });
    strict.addEventListener('change', () => {
      STATE.training.strictCore = !!strict.checked;
      saveTraining(STATE.training);
    });

    document.getElementById('recommendedKeywords').addEventListener('click', e => {
      const chip = e.target.closest('.chip-btn');
      if (!chip) return;
      const keywordInput = document.getElementById('keywordInput');
      const kw = chip.dataset.keyword;
      if (!kw) return;
      if (!keywordInput.value.trim()) keywordInput.value = kw;
      else if (!keywordInput.value.includes(kw)) keywordInput.value += `, ${kw}`;
      switchPage('maker');
    });
  }

  function tokenizeInput(input) {
    const tokens = String(input || '')
      .split(/[\n,\/|]+/)
      .map(t => normalizeSpace(t))
      .filter(Boolean)
      .map(t => t.replace(/["'“”‘’]/g, ''));
    return [...new Set(tokens)];
  }

  function getKeywordGrade(keyword) {
    const k = normalizeText(keyword);
    return STATE.keywordGrade.get(k)?.grade || 'B';
  }

  function keywordGradeWeight(grade) {
    if (grade === 'S') return 1.0;
    if (grade === 'A') return 0.82;
    return 0.64;
  }

  function eventMatchScore(event, token) {
    const tk = normalizeText(token);
    if (!tk) return 0;
    let score = 0;
    const name = normalizeText(event.name);
    if (name.includes(tk) || tk.includes(name)) score += 6;
    for (const kw of event.keywords || []) {
      const n = normalizeText(kw);
      if (!n) continue;
      if (n.includes(tk) || tk.includes(n)) score += 3;
    }
    score += IMP_WEIGHT[event.importance] || 0.7;
    return score;
  }

  function findAnchorEvents(tokens) {
    if (!tokens.length) {
      return STATE.events
        .slice()
        .sort((a, b) => (IMP_WEIGHT[b.importance] - IMP_WEIGHT[a.importance]) || (b.year - a.year))
        .slice(0, 20);
    }

    const scored = STATE.events.map(ev => {
      let score = 0;
      tokens.forEach(token => {
        score += eventMatchScore(ev, token);
      });
      return { ev, score };
    }).filter(row => row.score > 0);

    if (!scored.length) {
      return STATE.events
        .slice()
        .sort((a, b) => (IMP_WEIGHT[b.importance] - IMP_WEIGHT[a.importance]) || (b.year - a.year))
        .slice(0, 20);
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.ev).slice(0, 24);
  }

  function pickEvent(pool, avoidIds = new Set(), preferCore = true) {
    const rows = pool
      .filter(ev => !avoidIds.has(ev.id))
      .map(ev => {
        const imp = IMP_WEIGHT[ev.importance] || 0.7;
        const strictBonus = STATE.training.strictCore && preferCore && ev.importance !== 'B' ? 0.4 : 0;
        return { value: ev, weight: imp + strictBonus };
      });
    return weightedPick(rows);
  }

  function formatYear(year) {
    if (year < 0) return `기원전 ${Math.abs(year)}년`;
    return `${year}년`;
  }

  function makeMemoryTip(type, anchor, correct, other) {
    if (type === 'between') {
      return `🧭 ${anchor.name} | ${correct.name} | ${other.name} 순으로 3점 고정하세요.`;
    }
    if (type === 'cause') {
      return `💥 '${anchor.name} ⇒ ${correct.name}' 인과 사슬로 1문장 암기하세요.`;
    }
    if (type === 'sameEra') {
      return `🧩 ${anchor.name}와 ${correct.name}를 같은 시기 박스로 묶어 기억하세요.`;
    }
    return `⏳ '${anchor.name} → ${correct.name}' 화살표 한 줄로 연표를 잠그세요.`;
  }

  function buildCardGrade(anchor, keyword, type) {
    const impW = IMP_WEIGHT[anchor.importance] || 0.7;
    const kwW = keywordGradeWeight(getKeywordGrade(keyword || anchor.name));
    const tpW = TYPE_STRENGTH[type] || 0.8;
    const score = Number((impW * 0.5 + kwW * 0.3 + tpW * 0.2).toFixed(3));
    return { score, grade: gradeByScore(score) };
  }

  function typePoolByMode(mode) {
    const base = HISTORY_TEMPLATE_WEIGHTS[mode] || HISTORY_TEMPLATE_WEIGHTS.auto;
    const typeFreq = (window.HISTORY_SOURCE_SEEDS && window.HISTORY_SOURCE_SEEDS.typeFreq) || {};
    const sumFreq = Object.values(typeFreq).reduce((a, b) => a + Number(b || 0), 0) || 1;

    const rows = ['after', 'between', 'sameEra', 'cause'].map(type => {
      const baseW = Number(base[type] || 0);
      const srcW = Number(typeFreq[type] || 0) / sumFreq;
      const weight = baseW * (0.75 + srcW * 0.5);
      return { value: type, weight };
    });
    return rows;
  }

  function buildMCQCard(type, anchor, keyword, counter) {
    const all = STATE.events;
    if (!anchor) return null;

    if (type === 'after') {
      const correctPool = all.filter(ev => ev.year > anchor.year + 1);
      const wrongPool = all.filter(ev => ev.year <= anchor.year);
      const correct = pickEvent(correctPool, new Set([anchor.id]), true);
      if (!correct) return null;

      const avoid = new Set([anchor.id, correct.id]);
      const wrongs = shuffle(wrongPool.filter(ev => !avoid.has(ev.id))).slice(0, 3);
      if (wrongs.length < 3) return null;

      const choices = shuffle([correct, ...wrongs]);
      const answer = choices.findIndex(ev => ev.id === correct.id) + 1;
      const grade = buildCardGrade(anchor, keyword, type);

      return {
        id: `his_mcq_after_${counter}`,
        format: 'mcq',
        type,
        focusKeyword: keyword || anchor.name,
        stem: `다음 중 '${anchor.name}' 이후에 일어난 사건으로 가장 적절한 것은?`,
        choices: choices.map((ev, idx) => ({ num: idx + 1, text: ev.name, eventId: ev.id })),
        answer,
        importance: grade.grade,
        suitability: grade.grade,
        explanation: `${anchor.name}(${formatYear(anchor.year)}) 이후 사건은 ${correct.name}(${formatYear(correct.year)})입니다.`,
        memoryTip: makeMemoryTip(type, anchor, correct),
        anchors: [anchor.name],
        correctEvent: correct,
        budgetBase: 16
      };
    }

    if (type === 'between') {
      const rightBound = pickEvent(all.filter(ev => ev.year > anchor.year + 10), new Set([anchor.id]), true);
      if (!rightBound) return null;
      const [left, right] = anchor.year < rightBound.year ? [anchor, rightBound] : [rightBound, anchor];

      const betweenPool = all.filter(ev => ev.year > left.year && ev.year < right.year);
      const outsidePool = all.filter(ev => ev.year <= left.year || ev.year >= right.year);
      const correct = pickEvent(betweenPool, new Set([left.id, right.id]), true);
      if (!correct) return null;

      const avoid = new Set([left.id, right.id, correct.id]);
      const wrongs = shuffle(outsidePool.filter(ev => !avoid.has(ev.id))).slice(0, 3);
      if (wrongs.length < 3) return null;

      const choices = shuffle([correct, ...wrongs]);
      const answer = choices.findIndex(ev => ev.id === correct.id) + 1;
      const grade = buildCardGrade(left, keyword, type);

      return {
        id: `his_mcq_between_${counter}`,
        format: 'mcq',
        type,
        focusKeyword: keyword || left.name,
        stem: `'${left.name}'과 '${right.name}' 사이에 일어난 사건으로 옳은 것은?`,
        choices: choices.map((ev, idx) => ({ num: idx + 1, text: ev.name, eventId: ev.id })),
        answer,
        importance: grade.grade,
        suitability: grade.grade,
        explanation: `${left.name}(${formatYear(left.year)})과 ${right.name}(${formatYear(right.year)}) 사이의 사건은 ${correct.name}(${formatYear(correct.year)})입니다.`,
        memoryTip: makeMemoryTip(type, left, correct, right),
        anchors: [left.name, right.name],
        correctEvent: correct,
        budgetBase: 17
      };
    }

    if (type === 'sameEra') {
      const samePool = all.filter(ev => ev.era === anchor.era && ev.id !== anchor.id);
      const otherPool = all.filter(ev => ev.era !== anchor.era);
      const correct = pickEvent(samePool, new Set([anchor.id]), true);
      if (!correct) return null;

      const avoid = new Set([anchor.id, correct.id]);
      const wrongs = shuffle(otherPool.filter(ev => !avoid.has(ev.id))).slice(0, 3);
      if (wrongs.length < 3) return null;

      const choices = shuffle([correct, ...wrongs]);
      const answer = choices.findIndex(ev => ev.id === correct.id) + 1;
      const grade = buildCardGrade(anchor, keyword, type);

      return {
        id: `his_mcq_same_${counter}`,
        format: 'mcq',
        type,
        focusKeyword: keyword || anchor.name,
        stem: `'${anchor.name}'와 같은 시기의 사건으로 옳은 것은?`,
        choices: choices.map((ev, idx) => ({ num: idx + 1, text: ev.name, eventId: ev.id })),
        answer,
        importance: grade.grade,
        suitability: grade.grade,
        explanation: `${anchor.name}(${HISTORY_ERAS[anchor.era]})와 동시기 사건은 ${correct.name}입니다.`,
        memoryTip: makeMemoryTip(type, anchor, correct),
        anchors: [anchor.name],
        correctEvent: correct,
        budgetBase: 15
      };
    }

    // cause
    const effects = HISTORY_CAUSE_EFFECT_MAP[anchor.name] || [];
    const effectEvents = effects.map(name => STATE.eventByName.get(name)).filter(Boolean);
    if (!effectEvents.length) {
      return buildMCQCard('after', anchor, keyword, counter);
    }

    const correct = effectEvents[Math.floor(Math.random() * effectEvents.length)];
    const wrongPool = all.filter(ev => ev.id !== anchor.id && ev.id !== correct.id && !effects.includes(ev.name));
    const wrongs = shuffle(wrongPool).slice(0, 3);
    if (wrongs.length < 3) return null;
    const choices = shuffle([correct, ...wrongs]);
    const answer = choices.findIndex(ev => ev.id === correct.id) + 1;
    const grade = buildCardGrade(anchor, keyword, 'cause');

    return {
      id: `his_mcq_cause_${counter}`,
      format: 'mcq',
      type: 'cause',
      focusKeyword: keyword || anchor.name,
      stem: `'${anchor.name}'의 결과(영향)로 가장 적절한 것은?`,
      choices: choices.map((ev, idx) => ({ num: idx + 1, text: ev.name, eventId: ev.id })),
      answer,
      importance: grade.grade,
      suitability: grade.grade,
      explanation: `${anchor.name} 이후의 연결 사건으로 ${correct.name}을(를) 잡아야 합니다.`,
      memoryTip: makeMemoryTip('cause', anchor, correct),
      anchors: [anchor.name],
      correctEvent: correct,
      budgetBase: 16
    };
  }

  function buildOXCard(type, anchor, keyword, counter) {
    const mcq = buildMCQCard(type, anchor, keyword, counter);
    if (!mcq) return null;

    if (type === 'after') {
      const trueCase = Math.random() < 0.5;
      const candidate = trueCase
        ? mcq.correctEvent
        : pickEvent(STATE.events.filter(ev => ev.year <= anchor.year), new Set([anchor.id]), false);
      if (!candidate) return null;
      const grade = buildCardGrade(anchor, keyword, type);
      return {
        id: `his_ox_after_${counter}`,
        format: 'ox',
        type,
        focusKeyword: keyword || anchor.name,
        stem: `다음 진술의 O/X를 판단하시오.`,
        statement: `${candidate.name}은(는) ${anchor.name} 이후에 일어났다.`,
        answer: trueCase,
        importance: grade.grade,
        suitability: grade.grade,
        explanation: `${anchor.name}(${formatYear(anchor.year)}) / ${candidate.name}(${formatYear(candidate.year)}) 비교로 판단합니다.`,
        memoryTip: trueCase
          ? `⏳ ${anchor.name}→${candidate.name}를 연표 화살표로 고정하세요.`
          : `🚫 연표 위치가 뒤집힌 함정입니다. 기준 사건(${anchor.name}) 연도를 먼저 떠올리세요.`,
        anchors: [anchor.name],
        budgetBase: 8
      };
    }

    if (type === 'between') {
      const left = STATE.eventByName.get(mcq.anchors[0]);
      const right = STATE.eventByName.get(mcq.anchors[1]);
      if (!left || !right) return null;
      const trueCase = Math.random() < 0.5;
      const betweenPool = STATE.events.filter(ev => ev.year > left.year && ev.year < right.year);
      const outsidePool = STATE.events.filter(ev => ev.year <= left.year || ev.year >= right.year);
      const candidate = trueCase
        ? pickEvent(betweenPool, new Set([left.id, right.id]), true)
        : pickEvent(outsidePool, new Set([left.id, right.id]), false);
      if (!candidate) return null;
      const grade = buildCardGrade(left, keyword, type);
      return {
        id: `his_ox_between_${counter}`,
        format: 'ox',
        type,
        focusKeyword: keyword || left.name,
        stem: `다음 진술의 O/X를 판단하시오.`,
        statement: `${candidate.name}은(는) ${left.name}과 ${right.name} 사이의 사건이다.`,
        answer: trueCase,
        importance: grade.grade,
        suitability: grade.grade,
        explanation: `${left.name}(${formatYear(left.year)}) < ${candidate.name}(${formatYear(candidate.year)}) < ${right.name}(${formatYear(right.year)})인지 확인하세요.`,
        memoryTip: `🧭 ${left.name} | ${right.name} 경계선 안/밖만 먼저 판단하면 속도가 올라갑니다.`,
        anchors: [left.name, right.name],
        budgetBase: 9
      };
    }

    if (type === 'sameEra') {
      const trueCase = Math.random() < 0.5;
      const candidate = trueCase
        ? pickEvent(STATE.events.filter(ev => ev.era === anchor.era && ev.id !== anchor.id), new Set([anchor.id]), true)
        : pickEvent(STATE.events.filter(ev => ev.era !== anchor.era), new Set([anchor.id]), false);
      if (!candidate) return null;
      const grade = buildCardGrade(anchor, keyword, type);
      return {
        id: `his_ox_same_${counter}`,
        format: 'ox',
        type,
        focusKeyword: keyword || anchor.name,
        stem: `다음 진술의 O/X를 판단하시오.`,
        statement: `${candidate.name}은(는) ${anchor.name}와 같은 시기의 사건이다.`,
        answer: trueCase,
        importance: grade.grade,
        suitability: grade.grade,
        explanation: `${anchor.name}의 시대 구분(${HISTORY_ERAS[anchor.era]})을 기준으로 판단합니다.`,
        memoryTip: `🧩 사건을 시대 박스(선사/고려/조선/개항기 등)로 먼저 분류하세요.`,
        anchors: [anchor.name],
        budgetBase: 8
      };
    }

    // cause
    const effects = HISTORY_CAUSE_EFFECT_MAP[anchor.name] || [];
    if (!effects.length) {
      return buildOXCard('after', anchor, keyword, counter);
    }
    const trueCase = Math.random() < 0.5;
    const candidate = trueCase
      ? STATE.eventByName.get(effects[Math.floor(Math.random() * effects.length)])
      : pickEvent(STATE.events.filter(ev => !effects.includes(ev.name) && ev.id !== anchor.id), new Set([anchor.id]), false);
    if (!candidate) return null;
    const grade = buildCardGrade(anchor, keyword, 'cause');
    return {
      id: `his_ox_cause_${counter}`,
      format: 'ox',
      type: 'cause',
      focusKeyword: keyword || anchor.name,
      stem: `다음 진술의 O/X를 판단하시오.`,
      statement: `${anchor.name}의 결과(영향)로 ${candidate.name}이(가) 나타났다.`,
      answer: trueCase,
      importance: grade.grade,
      suitability: grade.grade,
      explanation: trueCase
        ? `${anchor.name}의 직접 연결 사건으로 ${candidate.name}을 기억하세요.`
        : `${candidate.name}은(는) ${anchor.name}의 직접 결과가 아닙니다.`,
      memoryTip: `💥 '${anchor.name} ⇒ 핵심결과' 1개만 먼저 고정하면 응용문항이 빨라집니다.`,
      anchors: [anchor.name],
      budgetBase: 8
    };
  }

  function generateCards(opts) {
    const tokens = tokenizeInput(opts.keywordText);
    const anchors = findAnchorEvents(tokens);
    const typePool = typePoolByMode(opts.mode);
    const cards = [];
    const stamp = Date.now().toString(36);
    let counter = 1;
    let guard = 0;

    while (cards.length < opts.count && guard < opts.count * 24) {
      guard += 1;
      const anchor = anchors[guard % anchors.length] || anchors[0];
      const type = weightedPick(typePool) || 'after';
      const keyword = tokens.length ? tokens[(guard - 1) % tokens.length] : (anchor ? anchor.name : '한국사');

      const format = opts.format === 'mixed'
        ? (Math.random() < 0.65 ? 'mcq' : 'ox')
        : opts.format;
      const seq = `${stamp}_${counter}`;

      const card = format === 'mcq'
        ? buildMCQCard(type, anchor, keyword, seq)
        : buildOXCard(type, anchor, keyword, seq);

      counter += 1;
      if (!card) continue;

      // 중복 stem 방지
      if (cards.some(c => c.stem === card.stem && c.statement === card.statement)) continue;
      cards.push(card);
    }

    return cards;
  }

  function renderGeneratedList() {
    const list = document.getElementById('generatedList');
    const summary = document.getElementById('generatedSummary');
    const startBtn = document.getElementById('startDrillBtn');

    if (!STATE.generatedCards.length) {
      list.innerHTML = '<div class="history-empty">아직 생성된 카드가 없습니다.</div>';
      summary.textContent = '';
      startBtn.disabled = true;
      return;
    }

    const counts = STATE.generatedCards.reduce((acc, c) => {
      acc.total += 1;
      acc[c.type] = (acc[c.type] || 0) + 1;
      acc[c.format] = (acc[c.format] || 0) + 1;
      return acc;
    }, { total: 0, mcq: 0, ox: 0, after: 0, between: 0, sameEra: 0, cause: 0 });

    summary.textContent = `${counts.total}장 생성 · 통합형 ${counts.mcq} / OX ${counts.ox}`;
    startBtn.disabled = false;

    list.innerHTML = STATE.generatedCards.slice(0, 30).map((card, idx) => {
      const text = card.format === 'mcq'
        ? card.stem
        : `${card.stem} ${card.statement}`;
      return `<div class="history-card-row">
        <div class="history-card-no">${idx + 1}</div>
        <div>
          <div class="history-card-text">${escapeHtml(text)}</div>
          <div class="history-badges">
            <span class="q-badge">${escapeHtml(TYPE_LABEL[card.type] || card.type)}</span>
            <span class="q-badge imp-${card.importance}">${card.importance}급</span>
            <span class="q-badge fit-${card.suitability}">적합 ${card.suitability}</span>
            <span class="q-badge">키워드: ${escapeHtml(card.focusKeyword || '')}</span>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  function getPressureNodes() {
    return {
      timer: document.getElementById('drillRopeTimer'),
      fill: document.getElementById('drillRopeFill'),
      burn: document.getElementById('drillRopeBurn'),
      text: document.getElementById('drillRopeText')
    };
  }

  function clearPressureTicker() {
    if (STATE.pressureTickerId) {
      clearInterval(STATE.pressureTickerId);
      STATE.pressureTickerId = null;
    }
  }

  function hidePressureTimer() {
    const n = getPressureNodes();
    if (!n.timer) return;
    n.timer.hidden = true;
    n.timer.classList.remove('warning', 'danger', 'burnt');
  }

  function renderPressure(elapsedSec, budgetSec, locked) {
    const n = getPressureNodes();
    if (!n.timer || !n.fill || !n.burn || !n.text) return;

    const elapsed = Math.max(0, elapsedSec);
    const budget = Math.max(1, budgetSec);
    const remain = Math.max(0, budget - elapsed);
    const ratio = Math.max(0, Math.min(1, remain / budget));
    const over = elapsed >= budget;

    n.timer.hidden = false;
    n.timer.classList.remove('warning', 'danger', 'burnt');
    if (ratio <= 0.4 || (locked && over)) n.timer.classList.add('warning');
    if (ratio <= 0.2 || (locked && over)) n.timer.classList.add('danger');
    if (over) n.timer.classList.add('burnt');

    n.fill.style.transform = `scaleX(${ratio})`;
    n.burn.style.left = `${(ratio * 100).toFixed(1)}%`;
    n.text.textContent = locked
      ? `결정 ${elapsed.toFixed(1)}초 / 기준 ${budget.toFixed(0)}초`
      : `남은 ${remain.toFixed(1)}초 / 기준 ${budget.toFixed(0)}초`;
  }

  function getCardBudget(card) {
    let base = card.format === 'mcq' ? 16 : 8;
    if (STATE.training.speedMode) base -= card.format === 'mcq' ? 3 : 2;
    if (card.importance === 'S') base += 2;
    if (card.importance === 'B') base -= 1;
    if (card.type === 'between') base += 1;
    return Math.max(card.format === 'mcq' ? 10 : 4, base);
  }

  function startPressure(budget) {
    clearPressureTicker();
    if (!STATE.drillStartTs) return;
    renderPressure(getElapsedSec(STATE.drillStartTs), budget, false);
    STATE.pressureTickerId = setInterval(() => {
      if (!STATE.drillStartTs) return;
      renderPressure(getElapsedSec(STATE.drillStartTs), budget, false);
    }, 100);
  }

  function lockPressure(elapsedSec) {
    clearPressureTicker();
    if (!STATE.drillPressureBudgetSec) return;
    renderPressure(elapsedSec, STATE.drillPressureBudgetSec, true);
  }

  function collectCheckedTags(cardId) {
    const root = document.getElementById(`metaTags_${cardId}`);
    if (!root) return [];
    return [...root.querySelectorAll('input[type="checkbox"]:checked')].map(i => i.value);
  }

  function renderTagChecklist(cardId) {
    return `<div class="drill-meta-tags" id="metaTags_${cardId}">
      ${HISTORY_WEAK_TAGS.map(t => `<label class="tag-pill"><input type="checkbox" value="${escapeHtml(t.id)}"> ${escapeHtml(t.label)}</label>`).join('')}
    </div>`;
  }

  function renderDrillQuestion() {
    const area = document.getElementById('drillQuestion');
    const card = STATE.drillCards[STATE.drillIndex];
    if (!card) {
      showDrillResult();
      return;
    }

    const answered = STATE.drillAnswers[card.id];
    if (answered === undefined && STATE.activeCardId !== card.id) {
      STATE.activeCardId = card.id;
      STATE.drillStartTs = performance.now();
      STATE.drillPressureBudgetSec = getCardBudget(card);
      startPressure(STATE.drillPressureBudgetSec);
    }

    let html = `<div class="q-card">
      <div class="q-meta">
        <span class="q-badge">${escapeHtml(TYPE_LABEL[card.type] || card.type)}</span>
        <span class="q-badge imp-${card.importance}">${card.importance}급</span>
        <span class="q-badge fit-${card.suitability}">적합 ${card.suitability}</span>
        <span class="q-badge">키워드: ${escapeHtml(card.focusKeyword || '')}</span>
      </div>
      <div class="q-text">${escapeHtml(card.stem)}</div>
      ${card.statement ? `<div class="ox-statement">${escapeHtml(card.statement)}</div>` : ''}
      ${renderTagChecklist(card.id)}
    `;

    if (card.format === 'mcq') {
      html += `<div class="choices-list">`;
      card.choices.forEach(c => {
        let cls = 'choice-btn';
        if (answered !== undefined) {
          cls += ' disabled';
          if (c.num === card.answer) cls += ' correct';
          else if (c.num === answered) cls += ' incorrect';
        }
        html += `<div class="${cls}" data-role="history-choice" data-num="${c.num}">
          <div class="choice-num">${c.num}</div>
          <div class="choice-text">${escapeHtml(c.text)}</div>
        </div>`;
      });
      html += `</div>`;
    } else {
      html += `<div class="ox-buttons">
        <button class="ox-btn o ${answered === true ? 'selected' : ''}" data-role="history-ox" data-val="O" ${answered !== undefined ? 'disabled' : ''}>⭕ O</button>
        <button class="ox-btn x ${answered === false ? 'selected' : ''}" data-role="history-ox" data-val="X" ${answered !== undefined ? 'disabled' : ''}>❌ X</button>
      </div>`;
    }

    if (answered !== undefined) {
      const correct = card.format === 'mcq' ? answered === card.answer : answered === card.answer;
      const sec = STATE.drillResponseSec[card.id] || 0;
      html += `<div class="answer-panel ${correct ? 'correct-panel' : 'incorrect-panel'}" style="margin-top:12px;">
        <div class="answer-result ${correct ? 'correct' : 'incorrect'}">
          ${correct ? '✅ 정답!' : '❌ 오답'}
        </div>
        <div class="answer-explain"><strong>⏱ 선택시간:</strong> ${sec.toFixed(1)}초</div>
        <div class="answer-explain"><strong>해설:</strong> ${escapeHtml(card.explanation)}</div>
        <div class="memory-tip"><span class="memory-tip-mode">암기팁</span>${escapeHtml(card.memoryTip)}</div>
      </div>`;
      lockPressure(sec);
    }

    html += `</div>`;
    area.innerHTML = html;
    document.getElementById('drillCounter').textContent = `${STATE.drillIndex + 1} / ${STATE.drillCards.length}`;
  }

  function updateRetryBucket(card, shouldQueue) {
    const idx = STATE.retryIndexById.get(card.id);
    if (shouldQueue) {
      if (idx !== undefined) return;
      STATE.retryCards.push(card);
      STATE.retryIndexById.set(card.id, STATE.retryCards.length - 1);
      saveRetryCards(STATE.retryCards);
      return;
    }

    if (idx === undefined) return;
    STATE.retryCards.splice(idx, 1);
    STATE.retryIndexById = new Map(STATE.retryCards.map((c, i) => [c.id, i]));
    saveRetryCards(STATE.retryCards);
  }

  function recordSolve(card, isCorrect, sec, tags) {
    const stats = loadStats();
    stats.attempts += 1;
    if (isCorrect) stats.correct += 1;
    stats.totalSec += sec;

    const today = new Date().toISOString().slice(0, 10);
    if (!stats.daily || stats.daily.date !== today) stats.daily = { date: today, count: 0 };
    stats.daily.count += 1;

    tags.forEach(tag => {
      stats.tagCounts[tag] = (stats.tagCounts[tag] || 0) + 1;
    });

    saveStats(stats);
    updateStreak();

    const slowThreshold = card.format === 'mcq' ? 12 : 7;
    const shouldRetry = !isCorrect || sec >= slowThreshold;
    updateRetryBucket(card, shouldRetry);
    logJournalAttempt({
      subject: 'his',
      mode: 'drill',
      qid: String(card.id),
      chapter: card.type,
      topic: card.focusKeyword || card.anchorName || card.stem,
      importance: card.importance,
      correct: Boolean(isCorrect),
      sec,
      tags,
      slowThreshold,
      source: 'history-drill'
    });
  }

  function selectDrillAnswer(value) {
    const card = STATE.drillCards[STATE.drillIndex];
    if (!card) return;
    if (STATE.drillAnswers[card.id] !== undefined) return;

    const sec = getElapsedSec(STATE.drillStartTs);
    STATE.drillResponseSec[card.id] = sec;
    const tags = collectCheckedTags(card.id);

    if (card.format === 'mcq') {
      STATE.drillAnswers[card.id] = Number(value);
      const correct = Number(value) === card.answer;
      recordSolve(card, correct, sec, tags);
    } else {
      const answer = value === 'O';
      STATE.drillAnswers[card.id] = answer;
      const correct = answer === card.answer;
      recordSolve(card, correct, sec, tags);
    }

    renderDrillQuestion();
    if (STATE.training.speedMode) {
      setTimeout(() => navDrill(1), 550);
    }
  }

  function navDrill(dir) {
    const next = STATE.drillIndex + dir;
    if (next < 0) return;
    if (next >= STATE.drillCards.length) {
      showDrillResult();
      return;
    }
    STATE.drillIndex = next;
    STATE.drillStartTs = 0;
    STATE.activeCardId = null;
    renderDrillQuestion();
  }

  function startDrill(cards) {
    if (!Array.isArray(cards) || !cards.length) {
      alert('먼저 카드생성을 해주세요.');
      switchPage('maker');
      return;
    }
    clearPressureTicker();
    hidePressureTimer();

    STATE.drillCards = cards;
    STATE.drillIndex = 0;
    STATE.drillAnswers = {};
    STATE.drillResponseSec = {};
    STATE.drillStartTs = 0;
    STATE.activeCardId = null;

    document.getElementById('drillSetup').style.display = 'none';
    document.getElementById('drillArea').style.display = 'block';
    document.getElementById('drillResult').style.display = 'none';
    switchPage('drill');
    renderDrillQuestion();
  }

  function startRetryDrill() {
    if (!STATE.retryCards.length) {
      alert('재압축 큐가 비어 있습니다.');
      return;
    }
    startDrill(STATE.retryCards.slice(0, 40));
  }

  function showDrillResult() {
    clearPressureTicker();
    hidePressureTimer();

    document.getElementById('drillArea').style.display = 'none';
    const result = document.getElementById('drillResult');

    const total = STATE.drillCards.length;
    let correct = 0;
    const secRows = Object.values(STATE.drillResponseSec);

    STATE.drillCards.forEach(card => {
      const ans = STATE.drillAnswers[card.id];
      if (ans === undefined) return;
      if (card.format === 'mcq') {
        if (ans === card.answer) correct += 1;
      } else if (ans === card.answer) {
        correct += 1;
      }
    });

    const pct = total ? Math.round((correct / total) * 100) : 0;
    const avg = secRows.length ? (secRows.reduce((a, b) => a + b, 0) / secRows.length).toFixed(1) : '0.0';
    const cls = pct >= 80 ? 'good' : pct >= 60 ? 'mid' : 'bad';

    result.style.display = 'block';
    result.innerHTML = `<div class="result-card">
      <h2 style="font-size:20px;font-weight:800;">📊 압축훈련 결과</h2>
      <div class="result-score ${cls}">${pct}%</div>
      <div class="result-detail">
        <div class="result-item"><div class="ri-label">총 카드</div><div class="ri-value">${total}</div></div>
        <div class="result-item"><div class="ri-label">정답</div><div class="ri-value" style="color:var(--correct)">${correct}</div></div>
        <div class="result-item"><div class="ri-label">오답</div><div class="ri-value" style="color:var(--incorrect)">${total - correct}</div></div>
      </div>
      <div class="answer-explain" style="margin-bottom:10px;"><strong>평균 선택시간:</strong> ${avg}초</div>
      <button class="btn btn-primary" id="retryCurrentSet">현재 세트 다시</button>
      <button class="btn btn-secondary" id="retryWeakSet" style="margin-left:8px;">오답·지연만 재압축</button>
    </div>`;

    document.getElementById('retryCurrentSet').addEventListener('click', () => startDrill(STATE.drillCards));
    document.getElementById('retryWeakSet').addEventListener('click', startRetryDrill);

    renderDashboard();
  }

  function renderRecommendedKeywords() {
    const el = document.getElementById('recommendedKeywords');
    const keywords = STATE.recommendedKeywords
      .map(k => ({ key: k, label: STATE.keywordLabel.get(k) || k }))
      .filter(row => row.label.length >= 2)
      .slice(0, 18);

    if (!keywords.length) {
      el.innerHTML = '<span class="scope-note">추천 키워드 준비 중</span>';
      return;
    }

    el.innerHTML = keywords.map(row => {
      const grade = getKeywordGrade(row.key);
      return `<button class="chip-btn" data-keyword="${escapeHtml(row.label)}">${escapeHtml(row.label)} <span class="chip-grade ${grade}">${grade}</span></button>`;
    }).join('');
  }

  function renderRetrySummary() {
    const el = document.getElementById('retryQueueSummary');
    if (!STATE.retryCards.length) {
      el.innerHTML = '<div class="scope-note">현재 재압축 큐가 비어 있습니다.</div>';
      return;
    }
    const typeCount = STATE.retryCards.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {});

    el.innerHTML = `<div style="display:flex;gap:8px;flex-wrap:wrap;">
      <span class="q-badge">큐 ${STATE.retryCards.length}장</span>
      <span class="q-badge">이후형 ${typeCount.after || 0}</span>
      <span class="q-badge">사이형 ${typeCount.between || 0}</span>
      <span class="q-badge">동시기형 ${typeCount.sameEra || 0}</span>
      <span class="q-badge">인과형 ${typeCount.cause || 0}</span>
    </div>`;
  }

  function renderDashboard() {
    const stats = loadStats();
    const attempts = Number(stats.attempts || 0);
    const correct = Number(stats.correct || 0);
    const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
    const avgSec = attempts ? (Number(stats.totalSec || 0) / attempts).toFixed(1) : '--.-';

    document.getElementById('statGenerated').textContent = String(STATE.generatedCards.length || loadLastSet().length || 0);
    document.getElementById('statAccuracy').textContent = `${accuracy}%`;
    document.getElementById('statAvgSec').textContent = `${avgSec}s`;
    document.getElementById('statToday').textContent = String(stats.daily?.count || 0);

    renderRecommendedKeywords();
    renderRetrySummary();
  }

  function renderGuide() {
    const stats = loadStats();
    const tags = Object.entries(stats.tagCounts || {}).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const topTag = tags.length
      ? tags.map(([k, v]) => `<span class="q-badge">${escapeHtml(k)} ${v}회</span>`).join(' ')
      : '<span class="scope-note">누적 태그 데이터가 아직 없습니다.</span>';

    document.getElementById('guideContent').innerHTML = `
      <div class="guide-card">
        <div class="guide-title">1) 시간이 없을 때 기본 루틴 (20분)</div>
        <div class="guide-text">키워드 1개 입력 → AUTO 20장 생성 → 오답·지연만 재압축 10장. 이 루틴만 반복하세요.</div>
      </div>
      <div class="guide-card">
        <div class="guide-title">2) 완벽 반응이 안 되는 문제 처리</div>
        <div class="guide-text">정답이 맞아도 12초(통합형)/7초(OX) 이상이면 미완성으로 간주하고 재압축 큐에 넣습니다. 최소 2회 연속 7초 이내 정답이 되기 전까지 제거하지 마세요.</div>
      </div>
      <div class="guide-card">
        <div class="guide-title">3) 키워드 입력 전략</div>
        <div class="guide-text">사건명 단일 키워드(예: 임진왜란)부터 시작하고, 익숙해지면 2개 키워드(예: 임진왜란, 병자호란)로 사이형 훈련 비중을 늘리세요.</div>
      </div>
      <div class="guide-card">
        <div class="guide-title">4) 현재 취약 태그</div>
        <div class="guide-text">${topTag}</div>
      </div>
      <div class="guide-card">
        <div class="guide-title">5) 기준 점수 90점용 운영 규칙</div>
        <div class="guide-text">정답률 85% 이상 + 평균반응 9초 이하를 3일 연속 유지한 뒤에만 카드 수를 30장으로 늘리세요. 조건 미달이면 20장 유지가 더 효율적입니다.</div>
      </div>
    `;
  }

  function handleGenerateCards() {
    const keywordText = document.getElementById('keywordInput').value;
    const mode = document.getElementById('keywordMode').value;
    const format = document.getElementById('cardFormat').value;
    const count = Number(document.getElementById('cardCount').value || 20);

    const cards = generateCards({ keywordText, mode, format, count });
    if (!cards.length) {
      alert('키워드에 맞는 카드를 만들지 못했습니다. 키워드를 바꿔서 다시 시도해주세요.');
      return;
    }

    STATE.generatedCards = cards;
    saveLastSet(cards);

    const stats = loadStats();
    stats.setsCreated = Number(stats.setsCreated || 0) + 1;
    saveStats(stats);

    renderGeneratedList();
    renderDashboard();
  }

  function bindDrillEvents() {
    document.getElementById('drillQuestion').addEventListener('click', e => {
      const choice = e.target.closest('[data-role="history-choice"]');
      if (choice) {
        selectDrillAnswer(Number(choice.dataset.num));
        return;
      }
      const ox = e.target.closest('[data-role="history-ox"]');
      if (ox) {
        selectDrillAnswer(ox.dataset.val);
      }
    });
  }

  function restoreLastSet() {
    const last = loadLastSet();
    if (!Array.isArray(last) || !last.length) return;
    STATE.generatedCards = last;
    renderGeneratedList();
  }

  function init() {
    STATE.training = { ...STATE.training, ...loadTraining() };

    prepareData();
    renderDday();
    syncJournalLink();
    setupSubjectSwitch();
    setupNav();
    setupButtons();
    bindDrillEvents();

    restoreLastSet();
    renderDashboard();
    renderGuide();
    applyAutoActionFromQuery();
  }

  function applyAutoActionFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const auto = params.get('auto');
    if (auto !== 'retry') return;
    startRetryDrill();
    params.delete('auto');
    const next = params.toString();
    const path = window.location.pathname;
    window.history.replaceState({}, '', next ? `${path}?${next}` : path);
  }

  init();
})();
