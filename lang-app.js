// 국어·영어 압축 인출 앱
(function () {
  'use strict';

  const SLOW_THRESHOLD_SEC = 9;
  const REVIEW_TRIGGER_SCORE = 1.4;

  const STORAGE = {
    history: 'lang_history_v1',
    streak: 'lang_streak_v1',
    training: 'lang_training_v1'
  };

  const EXAM_WEIGHTS = {
    '국가직': 1.0,
    '지방직': 0.88,
    '예시2차': 0.78,
    '예시1차': 0.74,
    '출제기조자료': 0.62
  };

  const FALLBACK_CHAPTER_WEIGHTS = {
    K01: 0.96, K02: 0.86, K03: 0.78, K04: 0.94, K05: 0.80,
    E01: 0.96, E02: 0.93, E03: 0.80, E04: 0.95, E05: 0.76
  };

  const MEMORY_TIP_RULES = {
    kor: [
      { re: /형태소|형태론|품사|통사/, tip: '🧩 형태소를 조립 블록처럼 쪼개서 품사-기능 순으로 1줄 요약하세요.' },
      { re: /논리|강화|약화|추론|논증/, tip: '🧠 결론 한 줄 먼저 찾고, 근거 문장을 화살표(→)로 연결해 즉시 판단하세요.' },
      { re: /맞춤법|표준어|띄어쓰기/, tip: '✍️ 헷갈린 규정은 정답 문장을 한 번 손으로 써서 근육기억으로 고정하세요.' },
      { re: /대화|화법|작문/, tip: '🎙️ 발화 의도(요구/거절/완화)만 먼저 잡으면 선지 비교 시간이 절반으로 줄어듭니다.' }
    ],
    eng: [
      { re: /문법|어법|동사|가정법|수일치/, tip: '🔧 문법은 동사부터: 시제-태-수일치 3점검 후 나머지를 보세요.' },
      { re: /어휘|빈칸|표현/, tip: '📚 빈칸은 감정/논리 연결어(However, Therefore) 먼저 보고 의미장을 좁히세요.' },
      { re: /순서|삽입|위치|어색한 문장/, tip: '🧭 대명사-지시어-연결어 순서로 연결고리를 잡으면 순서문항 속도가 급상승합니다.' },
      { re: /대화|응답|상황/, tip: '💬 대화문은 마지막 화자 의도 1개만 확정하고 선택지를 지우세요.' }
    ]
  };

  const STATE = {
    subject: 'kor',
    currentPage: 'dashboard',
    questions: [],
    questionMap: new Map(),
    candidateCount: 0,
    analytics: null,
    filters: { imp: 'all', chapter: 'all', sort: 'random', target: 'national9' },
    oxFilters: { imp: 'all', chapter: 'all', count: 20, target: 'national9' },
    training: { speedMode: false, recallFirst: true },
    autoNextTimerId: null,
    pressureTickerId: null,
    studyPressureBudgetSec: 0,
    oxPressureBudgetSec: 0,

    studyQuestions: [],
    studyIndex: 0,
    studyAnswers: {},
    studyResults: {},
    studyResponseSec: {},
    studyStartTs: 0,
    activeStudyKey: null,

    oxItems: [],
    oxIndex: 0,
    oxAnswers: {},
    oxResults: {},
    oxResponseSec: {},
    oxStartTs: 0,
    activeOxKey: null,

    pendingSelfMark: null
  };

  function uniq(arr) { return [...new Set(arr)]; }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function createGlobalRegex(re) {
    const flags = re.flags.includes('g') ? re.flags : re.flags + 'g';
    return new RegExp(re.source, flags);
  }

  function wrapTextNodes(html, regex, replacer) {
    return html.split(/(<[^>]+>)/g).map(part => {
      if (part.startsWith('<') && part.endsWith('>')) return part;
      return part.replace(regex, replacer);
    }).join('');
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function normalizeKeyword(kw) {
    return String(kw || '').replace(/\s+/g, '').trim();
  }

  function getImportanceWeight(imp) {
    if (imp === 'S') return 1.0;
    if (imp === 'A') return 0.82;
    return 0.64;
  }

  function getExamWeight(exam) {
    return EXAM_WEIGHTS[exam] ?? 0.65;
  }

  function gradeByScore(score) {
    if (score >= 0.86) return 'S';
    if (score >= 0.72) return 'A';
    return 'B';
  }

  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(STORAGE.history) || '{}'); } catch { return {}; }
  }

  function saveHistory(h) {
    localStorage.setItem(STORAGE.history, JSON.stringify(h));
  }

  function loadStreak() {
    try { return JSON.parse(localStorage.getItem(STORAGE.streak) || '{"count":0,"lastDate":""}'); }
    catch { return { count: 0, lastDate: '' }; }
  }

  function saveStreak(s) {
    localStorage.setItem(STORAGE.streak, JSON.stringify(s));
  }

  function loadTraining() {
    try { return JSON.parse(localStorage.getItem(STORAGE.training) || '{"speedMode":false,"recallFirst":true}'); }
    catch { return { speedMode: false, recallFirst: true }; }
  }

  function saveTraining(t) {
    localStorage.setItem(STORAGE.training, JSON.stringify(t));
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

  function clearAutoNext() {
    if (STATE.autoNextTimerId) {
      clearTimeout(STATE.autoNextTimerId);
      STATE.autoNextTimerId = null;
    }
  }

  function getElapsedSec(startTs) {
    if (!startTs) return 0;
    return Number(Math.max(0, (performance.now() - startTs) / 1000).toFixed(1));
  }

  function getPressureBudgetSec(mode, importance) {
    let base = mode === 'study'
      ? (STATE.training.speedMode ? 18 : 27)
      : (STATE.training.speedMode ? 6 : 8);
    if (importance === 'S') base += mode === 'study' ? 2 : 1;
    if (importance === 'B') base -= 1;
    const min = mode === 'study' ? 14 : 4;
    return Math.max(min, base);
  }

  function getPressureNodes(mode) {
    return {
      timer: document.getElementById(mode === 'study' ? 'studyRopeTimer' : 'oxRopeTimer'),
      fill: document.getElementById(mode === 'study' ? 'studyRopeFill' : 'oxRopeFill'),
      burn: document.getElementById(mode === 'study' ? 'studyRopeBurn' : 'oxRopeBurn'),
      text: document.getElementById(mode === 'study' ? 'studyRopeText' : 'oxRopeText')
    };
  }

  function clearPressureTicker() {
    if (STATE.pressureTickerId) {
      clearInterval(STATE.pressureTickerId);
      STATE.pressureTickerId = null;
    }
  }

  function hidePressureTimer(mode) {
    const nodes = getPressureNodes(mode);
    if (!nodes.timer) return;
    nodes.timer.hidden = true;
    nodes.timer.classList.remove('warning', 'danger', 'burnt');
  }

  function hideAllPressureTimers() {
    hidePressureTimer('study');
    hidePressureTimer('ox');
  }

  function renderPressureTimer(mode, elapsedSec, budgetSec, locked) {
    const nodes = getPressureNodes(mode);
    if (!nodes.timer || !nodes.fill || !nodes.burn || !nodes.text) return;

    const elapsed = Number.isFinite(elapsedSec) ? Math.max(0, elapsedSec) : 0;
    const budget = Math.max(1, Number.isFinite(budgetSec) ? budgetSec : 1);
    const remain = Math.max(0, budget - elapsed);
    const ratio = Math.max(0, Math.min(1, remain / budget));
    const over = elapsed >= budget;

    nodes.timer.hidden = false;
    nodes.timer.classList.remove('warning', 'danger', 'burnt');
    if (ratio <= 0.4 || (locked && over)) nodes.timer.classList.add('warning');
    if (ratio <= 0.2 || (locked && over)) nodes.timer.classList.add('danger');
    if (over) nodes.timer.classList.add('burnt');

    nodes.fill.style.transform = `scaleX(${ratio})`;
    nodes.burn.style.left = `${(ratio * 100).toFixed(1)}%`;
    nodes.text.textContent = locked
      ? `결정 ${elapsed.toFixed(1)}초 / 기준 ${budget.toFixed(0)}초`
      : `남은 ${remain.toFixed(1)}초 / 기준 ${budget.toFixed(0)}초`;
  }

  function startPressureTimer(mode, budgetSec) {
    clearPressureTicker();
    const startTs = mode === 'study' ? STATE.studyStartTs : STATE.oxStartTs;
    if (!startTs) return;
    renderPressureTimer(mode, getElapsedSec(startTs), budgetSec, false);
    STATE.pressureTickerId = setInterval(() => {
      const ts = mode === 'study' ? STATE.studyStartTs : STATE.oxStartTs;
      if (!ts) return;
      renderPressureTimer(mode, getElapsedSec(ts), budgetSec, false);
    }, 100);
  }

  function lockPressureTimer(mode, elapsedSec) {
    clearPressureTicker();
    const budget = mode === 'study' ? STATE.studyPressureBudgetSec : STATE.oxPressureBudgetSec;
    if (!budget) return;
    renderPressureTimer(mode, elapsedSec, budget, true);
  }

  function getInitialSubject() {
    const params = new URLSearchParams(window.location.search);
    const subject = params.get('subject');
    if (subject === 'eng' || subject === 'kor') return subject;
    return 'kor';
  }

  function getSubjectTitle(subject) {
    return subject === 'eng' ? '영어 압축 인출' : '국어 압축 인출';
  }

  function getTagOptions() {
    return LANG_WEAK_TAGS[STATE.subject] || [];
  }

  function inferSubject(raw) {
    if (raw.subject === 'kor' || raw.subject === 'eng') return raw.subject;
    if (String(raw.chapter || '').startsWith('K')) return 'kor';
    if (String(raw.chapter || '').startsWith('E')) return 'eng';
    const source = String(raw.sourceFile || '');
    if (source.includes('국어')) return 'kor';
    if (source.includes('영어')) return 'eng';
    return 'kor';
  }

  function normalizeChoice(choice, idx) {
    return {
      num: Number(choice?.num) || idx + 1,
      text: choice?.text || '',
      ...(typeof choice?.ox === 'boolean' ? { ox: choice.ox } : {})
    };
  }

  function normalizeQuestion(raw, fallbackVerified = false) {
    const subject = inferSubject(raw);
    const chapter = raw.chapter || (subject === 'kor' ? 'K03' : 'E03');
    const verified = Boolean(raw.verified || fallbackVerified || Number.isInteger(raw.answer));
    const choices = Array.isArray(raw.choices) ? raw.choices.map(normalizeChoice) : [];
    if (Number.isInteger(raw.answer) && choices.length) {
      choices.forEach(c => {
        if (typeof c.ox !== 'boolean') c.ox = c.num === Number(raw.answer);
      });
    }

    return {
      id: String(raw.id ?? `${subject}_${raw.year || 'x'}_${raw.sourceQuestionNo || Math.random().toString(16).slice(2, 8)}`),
      subject,
      year: Number(raw.year || 2025),
      exam: raw.exam || '예시1차',
      grade: Number(raw.grade || 9),
      chapter,
      topic: raw.topic || LANG_CHAPTERS[chapter] || chapter,
      importance: ['S', 'A', 'B'].includes(raw.importance) ? raw.importance : 'B',
      question: raw.question || '',
      type: raw.type || 'positive',
      choices,
      answer: Number.isInteger(raw.answer) ? Number(raw.answer) : null,
      keywords: Array.isArray(raw.keywords) ? raw.keywords.filter(Boolean) : [],
      keywordProfile: Array.isArray(raw.keywordProfile) ? raw.keywordProfile : [],
      sourceFile: raw.sourceFile || '',
      sourceQuestionNo: Number(raw.sourceQuestionNo || 0),
      verified,
      targetScore: typeof raw.targetScore === 'number' ? raw.targetScore : null,
      targetGrade: raw.targetGrade || null,
      sourceWeight: typeof raw.sourceWeight === 'number' ? raw.sourceWeight : null,
      chapterFrequencyWeight: typeof raw.chapterFrequencyWeight === 'number' ? raw.chapterFrequencyWeight : null,
      importanceWeight: typeof raw.importanceWeight === 'number' ? raw.importanceWeight : null,
      targetScoreRaw: typeof raw.targetScoreRaw === 'number' ? raw.targetScoreRaw : null,
      isNationalCore: Boolean(raw.isNationalCore),
      isNationalExtended: Boolean(raw.isNationalExtended)
    };
  }

  function applyData() {
    const base = Array.isArray(window.LANG_QUESTIONS) ? window.LANG_QUESTIONS : [];
    const supplement = Array.isArray(window.LANG_QUESTIONS_SUPPLEMENT) ? window.LANG_QUESTIONS_SUPPLEMENT : [];
    const candidates = Array.isArray(window.LANG_CANDIDATE_QUESTIONS) ? window.LANG_CANDIDATE_QUESTIONS : [];

    const rows = [];
    const idSet = new Set();

    base.forEach(raw => {
      const q = normalizeQuestion(raw, true);
      if (idSet.has(q.id)) return;
      rows.push(q);
      idSet.add(q.id);
    });

    supplement.forEach(raw => {
      const q = normalizeQuestion(raw, true);
      if (idSet.has(q.id)) return;
      rows.push(q);
      idSet.add(q.id);
    });

    candidates.forEach(raw => {
      const q = normalizeQuestion(raw, false);
      if (idSet.has(q.id)) return;
      rows.push(q);
      idSet.add(q.id);
    });

    STATE.questions = rows;
    STATE.candidateCount = rows.filter(q => !q.verified).length;
    STATE.questionMap = new Map(rows.map(q => [q.id, q]));
  }

  function buildChapterFrequencyWeights(pool) {
    const bucket = {};
    pool.forEach(q => {
      if (!q.chapter) return;
      const score = getExamWeight(q.exam) * getImportanceWeight(q.importance) * (q.verified ? 1.0 : 0.9);
      bucket[q.chapter] = (bucket[q.chapter] || 0) + score;
    });

    const values = Object.values(bucket);
    if (!values.length) return { ...FALLBACK_CHAPTER_WEIGHTS };

    const min = Math.min(...values);
    const max = Math.max(...values);
    const normalized = {};
    Object.entries(bucket).forEach(([chapter, value]) => {
      if (max === min) normalized[chapter] = 0.75;
      else normalized[chapter] = Number((0.48 + ((value - min) / (max - min)) * 0.52).toFixed(3));
    });

    return { ...FALLBACK_CHAPTER_WEIGHTS, ...normalized };
  }

  function calcTargetMetrics(q, chapterWeights) {
    const sourceWeight = getExamWeight(q.exam);
    const chapterFrequencyWeight = chapterWeights[q.chapter] ?? FALLBACK_CHAPTER_WEIGHTS[q.chapter] ?? 0.65;
    const importanceWeight = getImportanceWeight(q.importance);
    const raw = Number((sourceWeight + chapterFrequencyWeight + importanceWeight).toFixed(3));
    const score = Number((raw / 3).toFixed(3));
    return {
      sourceWeight: Number(sourceWeight.toFixed(3)),
      chapterFrequencyWeight: Number(chapterFrequencyWeight.toFixed(3)),
      importanceWeight: Number(importanceWeight.toFixed(3)),
      targetScoreRaw: raw,
      targetScore: score,
      targetGrade: gradeByScore(score)
    };
  }

  function prepareQuestionAnalytics() {
    const pool = STATE.questions;
    const chapterWeights = buildChapterFrequencyWeights(pool);

    const keywordScoresBySubject = { kor: {}, eng: {} };

    pool.forEach(q => {
      const metrics = calcTargetMetrics(q, chapterWeights);
      q.sourceWeight = metrics.sourceWeight;
      q.chapterFrequencyWeight = metrics.chapterFrequencyWeight;
      q.importanceWeight = metrics.importanceWeight;
      q.targetScoreRaw = metrics.targetScoreRaw;
      q.targetScore = metrics.targetScore;
      q.targetGrade = metrics.targetGrade;

      const isPrimaryNational = q.exam === '국가직';
      const isNear = q.exam === '지방직' || q.exam.includes('예시');
      q.isNationalCore = isPrimaryNational || (isNear && q.targetScore >= 0.76 && q.importance !== 'B');
      q.isNationalExtended = q.isNationalCore || (isNear && q.targetScore >= 0.68);

      const kwBucket = keywordScoresBySubject[q.subject] || (keywordScoresBySubject[q.subject] = {});
      const weight = getExamWeight(q.exam) * (q.importance === 'S' ? 1.15 : q.importance === 'A' ? 1.0 : 0.8);
      uniq((q.keywords || []).map(normalizeKeyword).filter(Boolean)).forEach(kw => {
        kwBucket[kw] = (kwBucket[kw] || 0) + weight;
      });
    });

    const keywordGradesBySubject = { kor: {}, eng: {} };
    ['kor', 'eng'].forEach(subject => {
      const bucket = keywordScoresBySubject[subject] || {};
      const sorted = Object.entries(bucket).sort((a, b) => b[1] - a[1]);
      if (!sorted.length) return;
      const sCut = sorted[Math.max(Math.floor(sorted.length * 0.32) - 1, 0)]?.[1] || 0;
      const aCut = sorted[Math.max(Math.floor(sorted.length * 0.68) - 1, 0)]?.[1] || 0;

      sorted.forEach(([kw, score], idx) => {
        let grade = 'B';
        if (score >= sCut) grade = 'S';
        else if (score >= aCut) grade = 'A';
        keywordGradesBySubject[subject][kw] = { score, rank: idx + 1, grade };
      });
    });

    pool.forEach(q => {
      q.keywordProfile = (q.keywords || []).map(kw => {
        const key = normalizeKeyword(kw);
        const info = keywordGradesBySubject[q.subject]?.[key];
        return { keyword: kw, grade: info ? info.grade : 'B' };
      });
    });

    STATE.analytics = {
      chapterWeights,
      keywordGradesBySubject
    };
  }

  function getSubjectPool() {
    return STATE.questions.filter(q => q.subject === STATE.subject);
  }

  function getFocusQuestions(mode) {
    const pool = getSubjectPool();
    if (mode === 'all') return pool;
    if (mode === 'expanded') return pool.filter(q => q.isNationalExtended);
    return pool.filter(q => q.isNationalCore);
  }

  function getTermGrade(term, subject = STATE.subject) {
    const key = normalizeKeyword(term);
    return STATE.analytics?.keywordGradesBySubject?.[subject]?.[key]?.grade || 'B';
  }

  function highlightKeywords(text, keywords) {
    let html = escapeHtml(text || '');
    const list = uniq((keywords || []).filter(Boolean)).sort((a, b) => b.length - a.length);
    list.forEach(kw => {
      const regex = new RegExp(escapeRegExp(kw), 'g');
      html = wrapTextNodes(html, regex, match => `<span class="keyword-highlight">${match}</span>`);
    });
    return html;
  }

  function calcDday() {
    const exam = new Date(LANG_EXAM_DATE);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    exam.setHours(0, 0, 0, 0);
    return Math.ceil((exam - now) / 86400000);
  }

  function recordHistory(key, q, verdict, sec, tags, mode) {
    const h = loadHistory();
    if (!h[key]) {
      h[key] = {
        attempts: 0,
        correct: 0,
        deferred: 0,
        totalSec: 0,
        avgSec: 0,
        lastDate: '',
        subject: q.subject,
        chapter: q.chapter,
        importance: q.importance,
        mode: mode,
        tags: {}
      };
    }

    const row = h[key];
    row.attempts += 1;
    if (verdict === true) row.correct += 1;
    else if (verdict === null) row.deferred = (row.deferred || 0) + 1;

    if (typeof sec === 'number' && Number.isFinite(sec)) {
      row.totalSec = Number(((row.totalSec || 0) + sec).toFixed(1));
      row.avgSec = Number((row.totalSec / row.attempts).toFixed(1));
      row.lastResponseSec = Number(sec.toFixed(1));
    }

    const tagMap = row.tags || {};
    (tags || []).forEach(tag => {
      tagMap[tag] = (tagMap[tag] || 0) + 1;
    });
    row.tags = tagMap;

    row.lastDate = new Date().toISOString().slice(0, 10);
    saveHistory(h);
    updateStreak();
    logJournalAttempt({
      subject: q.subject || STATE.subject,
      mode,
      qid: key,
      chapter: q.chapter,
      topic: q.topic,
      importance: q.importance,
      correct: verdict === null ? null : Boolean(verdict),
      sec,
      tags: tags || [],
      source: `lang-${mode}`
    });
  }

  function getTodayCount() {
    const h = loadHistory();
    const today = new Date().toISOString().slice(0, 10);
    return Object.values(h).filter(v => v.lastDate === today && v.subject === STATE.subject).length;
  }

  function getSubjectRows(history) {
    return Object.entries(history).filter(([, row]) => row.subject === STATE.subject);
  }

  function getRowAccuracy(row) {
    const effective = Math.max(0, (row.attempts || 0) - (row.deferred || 0));
    if (!effective) return 0.5;
    return (row.correct || 0) / effective;
  }

  function calcReviewPriority(q, row) {
    if (!row) return 2.3 * (q.importance === 'S' ? 1.15 : q.importance === 'A' ? 1.0 : 0.82);
    const attempts = row.attempts || 0;
    const deferred = row.deferred || 0;
    const effective = Math.max(1, attempts - deferred);
    const acc = (row.correct || 0) / effective;
    const avgSec = row.avgSec || 0;
    const wrongRatio = Math.max(0, 1 - acc);

    let score = wrongRatio * 2.0;
    if (attempts >= 2 && acc < 0.7) score += 0.6;
    if (avgSec >= SLOW_THRESHOLD_SEC) score += 0.5 + ((avgSec - SLOW_THRESHOLD_SEC) / 6);
    if (deferred > 0) score += Math.min(1.2, deferred * 0.35);

    const imp = q.importance === 'S' ? 1.15 : q.importance === 'A' ? 1.0 : 0.82;
    return Number((score * imp).toFixed(3));
  }

  function speedLabel(sec) {
    if (sec >= SLOW_THRESHOLD_SEC) return '느림';
    if (sec >= 4) return '보통';
    return '빠름';
  }

  function pickTipMode(historyKey, responseSec = 0) {
    const row = loadHistory()[historyKey] || {};
    const wrong = Math.max(0, (row.attempts || 0) - (row.correct || 0) - (row.deferred || 0));
    if (wrong >= 2 || responseSec >= SLOW_THRESHOLD_SEC + 1) return 'chant';
    if (STATE.training.speedMode) return 'ultra';
    return 'image';
  }

  function tipModeLabel(mode) {
    if (mode === 'ultra') return '초압축형';
    if (mode === 'chant') return '암송형';
    return '이미지형';
  }

  function buildMemoryTip(item, historyKey, responseSec = 0) {
    const bag = [item.topic || '', item.question || '', item.text || '', ...(item.keywords || [])].join(' ');
    const rules = MEMORY_TIP_RULES[item.subject || STATE.subject] || [];
    const rule = rules.find(r => r.re.test(bag));
    const k1 = (item.keywords || [])[0] || (item.topic || '핵심근거');
    const k2 = (item.keywords || [])[1] || '정답조건';
    const mode = pickTipMode(historyKey, responseSec);

    if (mode === 'ultra') return { label: tipModeLabel(mode), text: `⚡ ${k1}→${k2}만 고정하고 5초 내 반응하세요.` };
    if (mode === 'chant') return { label: tipModeLabel(mode), text: `🗣️ "${k1}면 ${k2}"를 3회 암송 후 즉시 재풀이하세요.` };
    if (rule) return { label: tipModeLabel(mode), text: rule.tip };
    return { label: tipModeLabel(mode), text: `🧠 ${k1}와 ${k2}를 한 장면으로 묶어 1줄로 말해 고정하세요.` };
  }

  function subjectExamLabel(subject) {
    return subject === 'eng' ? '영어' : '국어';
  }

  function updateSubjectUI() {
    const titleEl = document.getElementById('langHeaderTitle');
    if (titleEl) titleEl.textContent = getSubjectTitle(STATE.subject);

    const switchEl = document.getElementById('subjectSwitch');
    if (switchEl) switchEl.value = STATE.subject;

    document.title = `${subjectExamLabel(STATE.subject)} 압축 인출 앱`;
    const params = new URLSearchParams(window.location.search);
    params.set('subject', STATE.subject);
    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', next);
    syncJournalLink();
  }

  function syncJournalLink() {
    const link = document.getElementById('journalLink');
    if (!link) return;
    link.href = `journal.html?subject=${STATE.subject}`;
  }

  function syncTrainingOptionsUI() {
    const speed = document.getElementById('speedModeToggle');
    const recall = document.getElementById('recallModeToggle');
    if (speed) speed.checked = !!STATE.training.speedMode;
    if (recall) recall.checked = !!STATE.training.recallFirst;
  }

  function applyTrainingOptionsFromUI() {
    const speed = document.getElementById('speedModeToggle');
    const recall = document.getElementById('recallModeToggle');
    STATE.training.speedMode = speed ? !!speed.checked : STATE.training.speedMode;
    STATE.training.recallFirst = recall ? !!recall.checked : STATE.training.recallFirst;
    saveTraining(STATE.training);
  }

  function setupSubjectSwitch() {
    const el = document.getElementById('subjectSwitch');
    if (!el) return;
    el.addEventListener('change', e => {
      const value = e.target.value;
      if (value === 'law') {
        window.location.href = 'index.html';
        return;
      }
      if (value === 'admin') {
        window.location.href = 'admin.html';
        return;
      }
      if (value === 'his') {
        window.location.href = 'history.html';
        return;
      }
      if (value !== 'kor' && value !== 'eng') return;
      STATE.subject = value;
      clearAutoNext();
      updateSubjectUI();
      populateChapterSelects();
      updateFilteredCounts();
      renderDashboard();
      if (STATE.currentPage === 'weak') renderWeakAnalysis();
      if (STATE.currentPage === 'guide') renderGuide();
    });
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
    clearAutoNext();
    clearPressureTicker();
    if (page === 'study') {
      hidePressureTimer('ox');
    } else if (page === 'ox') {
      hidePressureTimer('study');
    } else {
      hideAllPressureTimers();
    }
    STATE.currentPage = page;

    document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.page === page));
    document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === `page-${page}`));

    if (page === 'study' && STATE.studyQuestions.length > 0 && document.getElementById('studyArea').style.display !== 'none') {
      renderStudyQuestion();
    }
    if (page === 'ox' && STATE.oxItems.length > 0 && document.getElementById('oxArea').style.display !== 'none') {
      renderOXQuestion();
    }

    if (page === 'dashboard') renderDashboard();
    if (page === 'weak') renderWeakAnalysis();
    if (page === 'guide') renderGuide();
  }

  function setupFilters() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      const filter = btn.dataset.filter;
      const value = btn.dataset.value;
      if (filter === 'imp') STATE.filters.imp = value;
      if (filter === 'ox-imp') STATE.oxFilters.imp = value;
      btn.parentElement.querySelectorAll('.filter-btn').forEach(b => {
        if (b.dataset.filter === filter) b.classList.toggle('active', b.dataset.value === value);
      });
      updateFilteredCounts();
    });

    document.getElementById('targetFilter').addEventListener('change', e => {
      STATE.filters.target = e.target.value;
      updateFilteredCounts();
    });
    document.getElementById('chapterFilter').addEventListener('change', e => {
      STATE.filters.chapter = e.target.value;
      updateFilteredCounts();
    });
    document.getElementById('sortOrder').addEventListener('change', e => {
      STATE.filters.sort = e.target.value;
    });

    document.getElementById('oxTargetFilter').addEventListener('change', e => {
      STATE.oxFilters.target = e.target.value;
      updateFilteredCounts();
    });
    document.getElementById('oxChapterFilter').addEventListener('change', e => {
      STATE.oxFilters.chapter = e.target.value;
      updateFilteredCounts();
    });
    document.getElementById('oxCount').addEventListener('change', e => {
      STATE.oxFilters.count = e.target.value === 'all' ? 'all' : Number(e.target.value);
      updateFilteredCounts();
    });

    const speed = document.getElementById('speedModeToggle');
    const recall = document.getElementById('recallModeToggle');
    if (speed) speed.addEventListener('change', applyTrainingOptionsFromUI);
    if (recall) recall.addEventListener('change', applyTrainingOptionsFromUI);

    document.getElementById('startStudy').addEventListener('click', startStudy);
    document.getElementById('startOX').addEventListener('click', startOX);
    document.getElementById('prevQ').addEventListener('click', () => navStudy(-1));
    document.getElementById('nextQ').addEventListener('click', () => navStudy(1));
    document.getElementById('prevOX').addEventListener('click', () => navOX(-1));
    document.getElementById('nextOX').addEventListener('click', () => navOX(1));

    document.addEventListener('click', e => {
      const action = e.target.closest('[data-role]');
      if (!action) return;

      const role = action.dataset.role;
      if (role === 'study-choice') {
        handleStudyChoice(Number(action.dataset.num));
      } else if (role === 'study-self') {
        handleSelfMark('study', action.dataset.verdict);
      } else if (role === 'ox-choice') {
        handleOXChoice(action.dataset.value === 'O');
      } else if (role === 'ox-self') {
        handleSelfMark('ox', action.dataset.verdict);
      } else if (role === 'start-review-queue') {
        STATE.filters.sort = 'review';
        document.getElementById('sortOrder').value = 'review';
        startStudy();
      }
    });
  }

  function populateChapterSelects() {
    const subjectPool = getSubjectPool();
    const chapters = [...new Set(subjectPool.map(q => q.chapter))].sort();

    const build = (id) => {
      const sel = document.getElementById(id);
      const current = sel.value;
      sel.innerHTML = '<option value="all">전체 단원</option>';
      chapters.forEach(ch => {
        const option = document.createElement('option');
        option.value = ch;
        option.textContent = LANG_CHAPTERS[ch] || ch;
        sel.appendChild(option);
      });
      if ([...sel.options].some(o => o.value === current)) sel.value = current;
      else sel.value = 'all';
    };

    build('chapterFilter');
    build('oxChapterFilter');
    STATE.filters.chapter = document.getElementById('chapterFilter').value;
    STATE.oxFilters.chapter = document.getElementById('oxChapterFilter').value;
  }

  function getFilteredQuestions() {
    let qs = getFocusQuestions(STATE.filters.target).filter(q => {
      if (STATE.filters.imp !== 'all' && q.importance !== STATE.filters.imp) return false;
      if (STATE.filters.chapter !== 'all' && q.chapter !== STATE.filters.chapter) return false;
      return true;
    });

    const h = loadHistory();
    if (STATE.filters.sort === 'random') qs = shuffle(qs);
    else if (STATE.filters.sort === 'importance') qs.sort((a, b) => 'SAB'.indexOf(a.importance) - 'SAB'.indexOf(b.importance));
    else if (STATE.filters.sort === 'year-desc') qs.sort((a, b) => b.year - a.year);
    else if (STATE.filters.sort === 'weak') {
      qs.sort((a, b) => {
        const ra = h[`q:${a.subject}:${a.id}`];
        const rb = h[`q:${b.subject}:${b.id}`];
        return getRowAccuracy(ra || { attempts: 0, correct: 0, deferred: 0 }) - getRowAccuracy(rb || { attempts: 0, correct: 0, deferred: 0 });
      });
    } else if (STATE.filters.sort === 'review') {
      qs.sort((a, b) => {
        const ra = h[`q:${a.subject}:${a.id}`];
        const rb = h[`q:${b.subject}:${b.id}`];
        return calcReviewPriority(b, rb) - calcReviewPriority(a, ra);
      });
    }
    return qs;
  }

  function getFilteredOX() {
    let items = [];
    getFocusQuestions(STATE.oxFilters.target).forEach(q => {
      if (STATE.oxFilters.imp !== 'all' && q.importance !== STATE.oxFilters.imp) return;
      if (STATE.oxFilters.chapter !== 'all' && q.chapter !== STATE.oxFilters.chapter) return;
      q.choices.forEach(c => {
        items.push({
          id: `${q.id}_${c.num}`,
          key: `ox:${q.subject}:${q.id}:${c.num}`,
          qid: q.id,
          chapter: q.chapter,
          topic: q.topic,
          importance: q.importance,
          text: c.text,
          answer: typeof c.ox === 'boolean' ? c.ox : null,
          verified: typeof c.ox === 'boolean' && q.verified,
          keywords: q.keywords || [],
          targetGrade: q.targetGrade || 'B',
          subject: q.subject,
          year: q.year,
          exam: q.exam
        });
      });
    });

    items = shuffle(items);
    const count = STATE.oxFilters.count;
    if (count === 'all') return items;
    return items.slice(0, Number(count) || 20);
  }

  function updateFilteredCounts() {
    const studyCount = getFilteredQuestions().length;
    const studyScope = getFocusQuestions(STATE.filters.target).length;
    const subjectPool = getSubjectPool();
    const studyExcluded = Math.max(0, subjectPool.length - studyScope);

    const verifiedCount = subjectPool.filter(q => q.verified).length;
    const candidateCount = subjectPool.length - verifiedCount;

    document.getElementById('filteredCount').textContent = `(${studyCount}문항 선택됨 · 검증완료 ${verifiedCount} · 검증대기 ${candidateCount})`;
    const studyScopeInfo = document.getElementById('targetScopeInfo');
    if (studyScopeInfo) studyScopeInfo.textContent = `${studyScope}문항 사용 / 범위외 ${studyExcluded}문항 제외`;

    const oxCount = getFilteredOX().length;
    const oxScope = getFocusQuestions(STATE.oxFilters.target).length;
    const oxExcluded = Math.max(0, subjectPool.length - oxScope);
    document.getElementById('oxFilteredCount').textContent = `(${oxCount}문항 생성됨 · 검증완료 우선)`;
    const oxScopeInfo = document.getElementById('oxTargetScopeInfo');
    if (oxScopeInfo) oxScopeInfo.textContent = `${oxScope}문항 사용 / 범위외 ${oxExcluded}문항 제외`;
  }

  function renderTagChecklist(scope) {
    const tags = getTagOptions();
    if (!tags.length) return '';
    return `<div class="q-card" style="margin-top:10px; padding:10px;">
      <div style="font-size:12px;font-weight:800;margin-bottom:6px;color:var(--text-muted);">메타인지 태그(복수 선택)</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${tags.map(t => `<label style="display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border:1px solid var(--border);border-radius:999px;font-size:12px;background:var(--surface2);">
          <input type="checkbox" data-tag-scope="${scope}" value="${escapeHtml(t.id)}">${escapeHtml(t.label)}
        </label>`).join('')}
      </div>
    </div>`;
  }

  function collectSelectedTags(scope) {
    return [...document.querySelectorAll(`input[data-tag-scope="${scope}"]:checked`)].map(el => el.value);
  }

  function buildKeywordChips(q) {
    const profile = Array.isArray(q.keywordProfile) && q.keywordProfile.length
      ? q.keywordProfile
      : (q.keywords || []).map(kw => ({ keyword: kw, grade: getTermGrade(kw, q.subject) }));
    return profile.slice(0, 8).map(item =>
      `<span class="q-badge" style="background:rgba(102,126,234,.12);border-color:rgba(102,126,234,.3);">${escapeHtml(item.keyword)} · ${item.grade}</span>`
    ).join('');
  }

  function buildStudyResultHtml(q, key) {
    const result = STATE.studyResults[key];
    if (!result || result.verdict === 'pending') return '';
    const sec = STATE.studyResponseSec[key] || 0;
    const tip = buildMemoryTip(q, key, sec);
    const isCorrect = result.verdict === 'correct';
    const status = result.verdict === 'defer'
      ? '<span class="q-badge" style="background:rgba(246,173,85,.18);border-color:rgba(246,173,85,.4);">보류 기록</span>'
      : (isCorrect
        ? '<span class="q-badge" style="background:rgba(56,178,172,.18);border-color:rgba(56,178,172,.4);">정답 기록</span>'
        : '<span class="q-badge" style="background:rgba(245,101,101,.18);border-color:rgba(245,101,101,.4);">오답 기록</span>');

    let answerLine = '';
    if (q.verified && Number.isInteger(q.answer)) {
      const correctChoice = q.choices.find(c => c.num === q.answer);
      answerLine = `<div class="answer-explain"><strong>정답:</strong> ${q.answer}번 ${escapeHtml(correctChoice?.text || '')}</div>`;
    } else {
      answerLine = `<div class="answer-explain"><strong>정답키 미연동:</strong> 공식 정답 확인 후 자기채점 기록이 반영되었습니다.</div>`;
    }

    return `<div class="answer-area" style="margin-top:10px;">
      ${status}
      <span class="q-badge">반응 ${sec.toFixed(1)}초 · ${speedLabel(sec)}</span>
      ${answerLine}
      <div class="memory-tip"><span class="memory-tip-mode">${escapeHtml(tip.label)}</span>${escapeHtml(tip.text)}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">${buildKeywordChips(q)}</div>
    </div>`;
  }

  function renderSelfMarkPanel(mode) {
    const label = mode === 'study' ? '통합형' : 'OX';
    return `<div class="q-card" style="margin-top:10px;padding:12px;border-left:3px solid var(--accent-blue);">
      <div style="font-size:13px;font-weight:800;margin-bottom:6px;">정답키 미연동 문항 (${label})</div>
      <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;">공식 정답 확인 후 즉시 자기채점하세요. (틀리거나 보류하면 복습 큐로 이동)</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-secondary" data-role="${mode}-self" data-verdict="correct">내가 맞음</button>
        <button class="btn btn-secondary" data-role="${mode}-self" data-verdict="wrong">내가 틀림</button>
        <button class="btn btn-secondary" data-role="${mode}-self" data-verdict="defer">보류(재확인)</button>
      </div>
    </div>`;
  }

  function renderStudyQuestion() {
    const el = document.getElementById('questionArea');
    const q = STATE.studyQuestions[STATE.studyIndex];
    if (!q) {
      el.innerHTML = '<div class="q-card">표시할 문제가 없습니다.</div>';
      return;
    }

    const key = `q:${q.subject}:${q.id}`;
    const selected = STATE.studyAnswers[key];
    const result = STATE.studyResults[key];
    const responseSec = STATE.studyResponseSec[key] || 0;

    if (!result) {
      if (STATE.activeStudyKey !== key || !STATE.studyStartTs) {
        STATE.activeStudyKey = key;
        STATE.studyStartTs = performance.now();
        STATE.studyPressureBudgetSec = getPressureBudgetSec('study', q.importance);
      } else if (!STATE.studyPressureBudgetSec) {
        STATE.studyPressureBudgetSec = getPressureBudgetSec('study', q.importance);
      }
      if (!STATE.pressureTickerId) {
        startPressureTimer('study', STATE.studyPressureBudgetSec);
      }
    } else if (result) {
      lockPressureTimer('study', responseSec || getElapsedSec(STATE.studyStartTs));
    }
    const recallCue = STATE.training.recallFirst
      ? `<div class="q-card" style="margin-bottom:10px;border-left:3px solid var(--accent-blue);padding:10px;">
          <div style="font-size:12px;font-weight:800;color:var(--text-muted);">인출선행 5초</div>
          <div style="font-size:13px;line-height:1.4;">핵심어 ${(q.keywords || []).slice(0, 3).join(' · ') || q.topic} 기준으로 정답 근거를 먼저 말한 뒤 선택하세요.</div>
        </div>`
      : '';

    let html = `
      <div class="q-card">
        <div class="q-meta">
          <span class="q-badge">${escapeHtml(LANG_SUBJECTS[q.subject] || q.subject)}</span>
          <span class="q-badge">${q.year} ${escapeHtml(q.exam)}</span>
          <span class="q-badge imp-${q.importance}">${q.importance}급</span>
          <span class="q-badge fit-${q.targetGrade || 'B'}">국가9 적합 ${q.targetGrade || 'B'}</span>
          <span class="q-badge">${q.verified ? '자동채점' : '자기채점'}</span>
        </div>
        <div class="q-topic">${escapeHtml(LANG_CHAPTERS[q.chapter] || q.chapter)} | ${escapeHtml(q.topic)}</div>
        <div class="q-text">${escapeHtml(q.question)}</div>
        ${recallCue}
        <div class="choices">
          ${q.choices.map(c => {
            const disabled = Boolean(result);
            const selectedClass = selected === c.num ? ' selected' : '';
            const text = result ? highlightKeywords(c.text, q.keywords) : escapeHtml(c.text);
            return `<button class="choice-btn${selectedClass}" data-role="study-choice" data-num="${c.num}" ${disabled ? 'disabled' : ''}>
              <span class="choice-num">${c.num}</span>
              <span class="choice-text">${text}</span>
            </button>`;
          }).join('')}
        </div>
        ${renderTagChecklist('study')}
      </div>
    `;

    if (result && result.verdict === 'pending') {
      html += renderSelfMarkPanel('study');
    }
    html += buildStudyResultHtml(q, key);

    if (responseSec > 0 && result && result.verdict !== 'pending') {
      html += `<div class="q-counter" style="margin-top:10px;">반응시간: ${responseSec.toFixed(1)}초 (${speedLabel(responseSec)})</div>`;
    }

    el.innerHTML = html;
    document.getElementById('qCounter').textContent = `${STATE.studyIndex + 1} / ${STATE.studyQuestions.length}`;
  }

  function startStudy() {
    const filtered = getFilteredQuestions();
    if (!filtered.length) {
      document.getElementById('studyArea').style.display = 'none';
      document.getElementById('studySetup').style.display = 'block';
      alert('현재 필터에서 선택된 문항이 없습니다.');
      return;
    }

    clearAutoNext();
    clearPressureTicker();
    hidePressureTimer('ox');
    STATE.studyQuestions = filtered;
    STATE.studyIndex = 0;
    STATE.studyAnswers = {};
    STATE.studyResults = {};
    STATE.studyResponseSec = {};
    STATE.pendingSelfMark = null;
    STATE.studyPressureBudgetSec = 0;

    document.getElementById('studySetup').style.display = 'none';
    document.getElementById('studyArea').style.display = 'block';
    document.getElementById('studyResult').style.display = 'none';

    STATE.studyStartTs = 0;
    STATE.activeStudyKey = null;
    renderStudyQuestion();
  }

  function handleStudyChoice(num) {
    const q = STATE.studyQuestions[STATE.studyIndex];
    if (!q) return;

    const key = `q:${q.subject}:${q.id}`;
    const result = STATE.studyResults[key];
    if (result && result.verdict !== 'pending') return;

    const sec = getElapsedSec(STATE.studyStartTs);
    const tags = collectSelectedTags('study');

    STATE.studyAnswers[key] = num;
    STATE.studyResponseSec[key] = sec;
    lockPressureTimer('study', sec);

    if (q.verified && Number.isInteger(q.answer)) {
      const correct = num === q.answer;
      STATE.studyResults[key] = { verdict: correct ? 'correct' : 'wrong', known: true };
      recordHistory(key, q, correct, sec, tags, 'study');
      renderStudyQuestion();

      if (STATE.training.speedMode) {
        clearAutoNext();
        STATE.autoNextTimerId = setTimeout(() => navStudy(1), 750);
      }
      return;
    }

    STATE.studyResults[key] = { verdict: 'pending', known: false };
    STATE.pendingSelfMark = { mode: 'study', key, q, sec, tags };
    renderStudyQuestion();
  }

  function navStudy(direction) {
    if (!STATE.studyQuestions.length) return;
    const nextIndex = STATE.studyIndex + direction;
    if (nextIndex < 0 || nextIndex >= STATE.studyQuestions.length) return;

    clearAutoNext();
    STATE.studyIndex = nextIndex;
    STATE.studyStartTs = 0;
    STATE.activeStudyKey = null;
    STATE.pendingSelfMark = null;
    renderStudyQuestion();
  }

  function renderOXQuestion() {
    const el = document.getElementById('oxQuestion');
    const item = STATE.oxItems[STATE.oxIndex];
    if (!item) {
      el.innerHTML = '<div class="q-card">표시할 OX 문항이 없습니다.</div>';
      return;
    }

    const key = item.key;
    const result = STATE.oxResults[key];
    const selected = STATE.oxAnswers[key];
    const responseSec = STATE.oxResponseSec[key] || 0;

    if (!result) {
      if (STATE.activeOxKey !== key || !STATE.oxStartTs) {
        STATE.activeOxKey = key;
        STATE.oxStartTs = performance.now();
        STATE.oxPressureBudgetSec = getPressureBudgetSec('ox', item.importance);
      } else if (!STATE.oxPressureBudgetSec) {
        STATE.oxPressureBudgetSec = getPressureBudgetSec('ox', item.importance);
      }
      if (!STATE.pressureTickerId) {
        startPressureTimer('ox', STATE.oxPressureBudgetSec);
      }
    } else if (result) {
      lockPressureTimer('ox', responseSec || getElapsedSec(STATE.oxStartTs));
    }

    let html = `
      <div class="q-card">
        <div class="q-meta">
          <span class="q-badge">${escapeHtml(LANG_SUBJECTS[item.subject] || item.subject)}</span>
          <span class="q-badge">${item.year} ${escapeHtml(item.exam)}</span>
          <span class="q-badge imp-${item.importance}">${item.importance}급</span>
          <span class="q-badge fit-${item.targetGrade || 'B'}">국가9 적합 ${item.targetGrade || 'B'}</span>
          <span class="q-badge">${item.verified ? '자동채점' : '자기채점'}</span>
        </div>
        <div class="q-topic">${escapeHtml(LANG_CHAPTERS[item.chapter] || item.chapter)} | ${escapeHtml(item.topic)}</div>
        <div class="ox-statement">${result ? highlightKeywords(item.text, item.keywords) : escapeHtml(item.text)}</div>
        <div style="display:flex;gap:12px;margin-top:12px;">
          <button class="btn ${selected === true ? 'btn-primary' : 'btn-secondary'}" data-role="ox-choice" data-value="O" ${result ? 'disabled' : ''}>⭕ O</button>
          <button class="btn ${selected === false ? 'btn-primary' : 'btn-secondary'}" data-role="ox-choice" data-value="X" ${result ? 'disabled' : ''}>❌ X</button>
        </div>
        ${renderTagChecklist('ox')}
      </div>
    `;

    if (result && result.verdict === 'pending') html += renderSelfMarkPanel('ox');

    if (result && result.verdict !== 'pending') {
      const tip = buildMemoryTip(item, key, responseSec);
      const status = result.verdict === 'defer'
        ? '보류 기록'
        : (result.verdict === 'correct' ? '정답 기록' : '오답 기록');

      html += `<div class="answer-area" style="margin-top:10px;">
        <span class="q-badge">${status}</span>
        <span class="q-badge">반응 ${responseSec.toFixed(1)}초 · ${speedLabel(responseSec)}</span>
        ${item.verified ? `<div class="answer-explain"><strong>정답:</strong> ${item.answer ? 'O' : 'X'}</div>` : '<div class="answer-explain"><strong>정답키 미연동:</strong> 자기채점 결과가 기록되었습니다.</div>'}
        <div class="memory-tip"><span class="memory-tip-mode">${escapeHtml(tip.label)}</span>${escapeHtml(tip.text)}</div>
      </div>`;
    }

    el.innerHTML = html;
    document.getElementById('oxCounter').textContent = `${STATE.oxIndex + 1} / ${STATE.oxItems.length}`;
  }

  function startOX() {
    const items = getFilteredOX();
    if (!items.length) {
      document.getElementById('oxArea').style.display = 'none';
      document.getElementById('oxSetup').style.display = 'block';
      alert('현재 필터에서 생성 가능한 OX 문항이 없습니다.');
      return;
    }

    clearAutoNext();
    clearPressureTicker();
    hidePressureTimer('study');
    STATE.oxItems = items;
    STATE.oxIndex = 0;
    STATE.oxAnswers = {};
    STATE.oxResults = {};
    STATE.oxResponseSec = {};
    STATE.pendingSelfMark = null;
    STATE.oxPressureBudgetSec = 0;

    document.getElementById('oxSetup').style.display = 'none';
    document.getElementById('oxArea').style.display = 'block';
    document.getElementById('oxResult').style.display = 'none';

    STATE.oxStartTs = 0;
    STATE.activeOxKey = null;
    renderOXQuestion();
  }

  function handleOXChoice(value) {
    const item = STATE.oxItems[STATE.oxIndex];
    if (!item) return;

    const key = item.key;
    const result = STATE.oxResults[key];
    if (result && result.verdict !== 'pending') return;

    const sec = getElapsedSec(STATE.oxStartTs);
    const tags = collectSelectedTags('ox');

    STATE.oxAnswers[key] = value;
    STATE.oxResponseSec[key] = sec;
    lockPressureTimer('ox', sec);

    if (item.verified && typeof item.answer === 'boolean') {
      const correct = value === item.answer;
      STATE.oxResults[key] = { verdict: correct ? 'correct' : 'wrong', known: true };
      recordHistory(key, item, correct, sec, tags, 'ox');
      renderOXQuestion();

      if (STATE.training.speedMode) {
        clearAutoNext();
        STATE.autoNextTimerId = setTimeout(() => navOX(1), 650);
      }
      return;
    }

    STATE.oxResults[key] = { verdict: 'pending', known: false };
    STATE.pendingSelfMark = { mode: 'ox', key, q: item, sec, tags };
    renderOXQuestion();
  }

  function navOX(direction) {
    if (!STATE.oxItems.length) return;
    const nextIndex = STATE.oxIndex + direction;
    if (nextIndex < 0 || nextIndex >= STATE.oxItems.length) return;

    clearAutoNext();
    STATE.oxIndex = nextIndex;
    STATE.oxStartTs = 0;
    STATE.activeOxKey = null;
    STATE.pendingSelfMark = null;
    renderOXQuestion();
  }

  function handleSelfMark(mode, verdictRaw) {
    const pending = STATE.pendingSelfMark;
    if (!pending || pending.mode !== mode) return;

    const verdict = verdictRaw === 'correct' ? true : verdictRaw === 'wrong' ? false : null;
    const stateObj = mode === 'study' ? STATE.studyResults : STATE.oxResults;
    stateObj[pending.key] = {
      verdict: verdictRaw,
      known: false
    };

    recordHistory(pending.key, pending.q, verdict, pending.sec, pending.tags, mode);
    STATE.pendingSelfMark = null;

    if (mode === 'study') {
      renderStudyQuestion();
      if (STATE.training.speedMode) {
        clearAutoNext();
        STATE.autoNextTimerId = setTimeout(() => navStudy(1), 700);
      }
    } else {
      renderOXQuestion();
      if (STATE.training.speedMode) {
        clearAutoNext();
        STATE.autoNextTimerId = setTimeout(() => navOX(1), 600);
      }
    }
  }

  function renderDashboard() {
    const h = loadHistory();
    const subjectRows = getSubjectRows(h);
    const subjectPool = getSubjectPool();

    let attempts = 0;
    let correct = 0;
    subjectRows.forEach(([, row]) => {
      attempts += Math.max(0, (row.attempts || 0) - (row.deferred || 0));
      correct += row.correct || 0;
    });

    const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
    document.getElementById('statTotal').textContent = `${subjectRows.length} / ${subjectPool.length}`;
    document.getElementById('statAccuracy').textContent = `${accuracy}%`;
    document.getElementById('statToday').textContent = String(getTodayCount());
    document.getElementById('statStreak').textContent = String(loadStreak().count || 0);

    renderPriorityTasks(h, subjectPool);
    renderChapterProgress(h, subjectPool);
  }

  function renderPriorityTasks(history, subjectPool) {
    const el = document.getElementById('priorityTasks');
    const tagScores = {};

    const chapterWeak = subjectPool.map(q => {
      const row = history[`q:${q.subject}:${q.id}`];
      return {
        q,
        priority: calcReviewPriority(q, row)
      };
    }).sort((a, b) => b.priority - a.priority);

    Object.values(history).forEach(row => {
      if (row.subject !== STATE.subject) return;
      Object.entries(row.tags || {}).forEach(([tag, count]) => {
        tagScores[tag] = (tagScores[tag] || 0) + Number(count || 0);
      });
    });

    const topTags = Object.entries(tagScores).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const topQuestions = chapterWeak.slice(0, 5);

    let html = '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">';
    if (topTags.length) {
      topTags.forEach(([tag, count]) => {
        const label = (getTagOptions().find(t => t.id === tag)?.label) || tag;
        html += `<span class="q-badge">${escapeHtml(label)} ${count}회</span>`;
      });
    } else {
      html += '<span class="q-badge">태그 데이터 없음 (학습 중 체크 권장)</span>';
    }
    html += '</div>';

    html += '<div style="display:grid;gap:6px;">';
    topQuestions.forEach(item => {
      html += `<div class="q-card" style="padding:8px;border-left:3px solid var(--accent-red);">
        <div style="font-size:12px;color:var(--text-muted);">${escapeHtml(LANG_CHAPTERS[item.q.chapter] || item.q.chapter)} | ${item.q.importance}급</div>
        <div style="font-size:13px;line-height:1.35;">${escapeHtml(item.q.question).slice(0, 110)}...</div>
      </div>`;
    });
    html += '</div>';

    el.innerHTML = html;
  }

  function renderChapterProgress(history, subjectPool) {
    const el = document.getElementById('chapterGrid');
    const chapters = [...new Set(subjectPool.map(q => q.chapter))].sort();

    let html = '';
    chapters.forEach(ch => {
      const rows = subjectPool.filter(q => q.chapter === ch);
      let attempt = 0;
      let solved = 0;
      rows.forEach(q => {
        const row = history[`q:${q.subject}:${q.id}`];
        if (!row) return;
        attempt += row.attempts || 0;
        if ((row.attempts || 0) > 0) solved += 1;
      });
      const pct = rows.length ? Math.round((solved / rows.length) * 100) : 0;
      html += `<div class="chapter-card">
        <div style="font-size:13px;font-weight:800;">${escapeHtml(LANG_CHAPTERS[ch] || ch)}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">학습 ${solved}/${rows.length} · 시도 ${attempt}회</div>
        <div class="progress-bar" style="margin-top:10px;"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>`;
    });

    el.innerHTML = html || '<div class="q-card">단원 데이터가 없습니다.</div>';
  }

  function renderWeakAnalysis() {
    const el = document.getElementById('weakAnalysis');
    const h = loadHistory();
    const pool = getFocusQuestions('all');

    const weak = pool.map(q => {
      const row = h[`q:${q.subject}:${q.id}`];
      return {
        q,
        row,
        priority: calcReviewPriority(q, row)
      };
    }).sort((a, b) => b.priority - a.priority);

    const slow = weak.filter(item => (item.row?.avgSec || 0) >= SLOW_THRESHOLD_SEC).length;
    const defer = weak.filter(item => (item.row?.deferred || 0) > 0).length;
    const repeatWrong = weak.filter(item => {
      const row = item.row;
      if (!row) return false;
      const wrong = Math.max(0, (row.attempts || 0) - (row.correct || 0) - (row.deferred || 0));
      return wrong >= 2;
    }).length;

    let html = `
      <div class="q-card" style="margin-bottom:12px;">
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <span class="q-badge">🔴 반복오답 ${repeatWrong}</span>
          <span class="q-badge">🟠 지연 ${slow}</span>
          <span class="q-badge">🟡 보류 ${defer}</span>
          <span class="q-badge">즉시복습 큐 ${weak.filter(w => w.priority >= REVIEW_TRIGGER_SCORE).length}</span>
        </div>
      </div>
    `;

    html += '<div style="display:grid;gap:8px;">';
    weak.slice(0, 20).forEach(item => {
      const row = item.row || { attempts: 0, correct: 0, deferred: 0, avgSec: 0 };
      const effective = Math.max(0, row.attempts - row.deferred);
      const acc = effective ? Math.round((row.correct / effective) * 100) : 0;
      html += `<div class="q-card" style="padding:10px;">
        <div style="font-size:12px;color:var(--text-muted);">${escapeHtml(LANG_CHAPTERS[item.q.chapter] || item.q.chapter)} | ${item.q.importance}급 | 우선순위 ${item.priority.toFixed(2)}</div>
        <div style="font-size:13px;line-height:1.35;margin-top:4px;">${escapeHtml(item.q.question).slice(0, 120)}...</div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:6px;">정확도 ${acc}% · 평균 ${Number(row.avgSec || 0).toFixed(1)}초 · 보류 ${row.deferred || 0}</div>
      </div>`;
    });
    html += '</div>';

    el.innerHTML = html;
  }

  function renderGuide() {
    const el = document.getElementById('guideContent');
    const h = loadHistory();
    const audit = (window.LANG_SOURCE_AUDIT && Array.isArray(window.LANG_SOURCE_AUDIT.sources))
      ? window.LANG_SOURCE_AUDIT
      : null;

    const pool = getSubjectPool();
    const core = getFocusQuestions('national9');
    const verified = pool.filter(q => q.verified).length;
    const candidate = pool.length - verified;
    const auditSources = audit ? audit.sources.filter(s => s.subject === STATE.subject) : [];
    const detected = auditSources.reduce((sum, s) => sum + Number(s.detected_questions || 0), 0);
    const added = auditSources.reduce((sum, s) => sum + Number(s.added_verified || 0) + Number(s.added_candidates || 0), 0);
    const excluded = Math.max(0, detected - added);

    const dday = Math.max(1, calcDday());
    const cycleGoal = dday >= 35 ? 3.0 : (dday >= 18 ? 2.0 : 1.5);
    const dailyStem = Math.max(20, Math.ceil((core.length * cycleGoal) / dday));
    const dailyOx = Math.max(40, Math.ceil(((core.length * 4) * Math.min(cycleGoal, 1.3)) / dday));

    const weakRows = getSubjectRows(h).map(([, row]) => row);
    const repeatWrong = weakRows.filter(row => Math.max(0, (row.attempts || 0) - (row.correct || 0) - (row.deferred || 0)) >= 2).length;
    const slow = weakRows.filter(row => (row.avgSec || 0) >= SLOW_THRESHOLD_SEC).length;
    const defer = weakRows.filter(row => (row.deferred || 0) > 0).length;

    const focusLabel = STATE.subject === 'kor'
      ? '국어 약점(문법·형태론, 논리)'
      : '영어 약점(문법, 어휘, 순서·삽입)';

    el.innerHTML = `
      <div class="guide-grid">
        <div class="guide-card">
          <div class="guide-title">문제은행 현황</div>
          <div class="guide-value">${core.length}문</div>
          <div class="guide-desc">핵심범위 ${core.length}문항 / 전체 ${pool.length}문항</div>
          <div class="guide-desc">검증완료 ${verified}문항 · 검증대기 ${candidate}문항</div>
          <div class="guide-desc">자동점검 탐지 ${detected || pool.length}문 · 반영 ${added || pool.length}문 · 제외 ${excluded}문</div>
          <div class="guide-desc">정답키 미연동 문항도 자기채점 방식으로 즉시 반복 인출 가능합니다.</div>
        </div>
        <div class="guide-card">
          <div class="guide-title">시간 압축 목표</div>
          <div class="guide-value">D-${dday}</div>
          <div class="guide-desc">하루 통합형 ${dailyStem}문 + OX ${dailyOx}문</div>
          <div class="guide-desc">권장 회전수 ${cycleGoal.toFixed(1)}회독</div>
          <div class="guide-desc">우선영역: ${focusLabel}</div>
        </div>
        <div class="guide-card">
          <div class="guide-title">불완전 반응 현황</div>
          <div class="guide-desc">🔴 반복오답 ${repeatWrong}문항</div>
          <div class="guide-desc">🟠 지연 ${slow}문항</div>
          <div class="guide-desc">🟡 보류 ${defer}문항</div>
          <button class="btn btn-primary" data-role="start-review-queue" style="margin-top:10px;">취약 큐 바로 시작</button>
        </div>
      </div>

      <div class="guide-card" style="margin-top:12px;">
        <div class="guide-title">완벽한 반응이 안되는 문제 처리 규칙</div>
        <div class="guide-list">
          <div>1. <strong>1회 오답</strong>: 같은 날 10분 내 재풀이 1회, 정답근거 1줄 암송.</div>
          <div>2. <strong>2회 이상 오답</strong>: 1-3-7일 간격으로 재풀이(총 3회), 태그 1개만 고정.</div>
          <div>3. <strong>지연(평균 ${SLOW_THRESHOLD_SEC}초+)</strong>: 5초 인출선행 ON으로 같은 유형 3연속 훈련.</div>
          <div>4. <strong>보류 문항</strong>: 보류 즉시 근거 문장 표시 → 24시간 내 재판단, 미해결이면 절차카드로 전환.</div>
          <div>5. <strong>정답키 미연동 문항</strong>: 공식 정답 확인 후 자기채점(맞음/틀림/보류) 기록, 틀림·보류는 자동 복습큐.</div>
          <div>6. <strong>자동 제외 문항</strong>: 원본 PDF에서 선택지 텍스트 확인 후 <code>analysis/lang_answer_keys.json</code>과 함께 수동 보강.</div>
        </div>
      </div>

      <div class="guide-card" style="margin-top:12px;">
        <div class="guide-title">90점 압축 루틴 (2시간 기준)</div>
        <div class="guide-list">
          <div>1. 50분: 통합형 20문 (근거 1줄 말하기 포함)</div>
          <div>2. 35분: 취약 큐(반복오답·지연·보류만)</div>
          <div>3. 25분: OX 속도훈련 (스피드모드 ON)</div>
          <div>4. 10분: 오늘 태그 상위 2개만 절차카드로 정리</div>
        </div>
      </div>

      <div class="guide-card" style="margin-top:12px;">
        <div class="guide-title">정답키 연동 방법</div>
        <div class="guide-list">
          <div>1. <code>analysis/lang_answer_keys.json</code> 파일에 파일명별 문항 정답 입력</div>
          <div>2. <code>python3 analysis/build_lang_bank.py</code> 실행</div>
          <div>3. 생성된 <code>lang-data-supplement.js</code>가 자동 반영되어 자동채점 문항으로 전환</div>
        </div>
      </div>
    `;
  }

  function renderDday() {
    const d = calcDday();
    const el = document.getElementById('ddayBadge');
    el.textContent = d > 0 ? `D-${d}` : d === 0 ? 'D-DAY!' : `D+${Math.abs(d)}`;
  }

  function applyAutoActionFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const auto = params.get('auto');
    if (auto !== 'review') return;
    STATE.filters.sort = 'review';
    const sort = document.getElementById('sortOrder');
    if (sort) sort.value = 'review';
    switchPage('study');
    startStudy();
    params.delete('auto');
    const next = params.toString();
    const path = window.location.pathname;
    window.history.replaceState({}, '', next ? `${path}?${next}` : path);
  }

  function init() {
    STATE.subject = getInitialSubject();
    STATE.training = { ...STATE.training, ...loadTraining() };

    applyData();
    prepareQuestionAnalytics();

    updateSubjectUI();
    renderDday();
    setupSubjectSwitch();
    setupNav();
    setupFilters();
    populateChapterSelects();
    syncTrainingOptionsUI();
    updateFilteredCounts();
    renderDashboard();
    applyAutoActionFromQuery();
  }

  init();
})();
