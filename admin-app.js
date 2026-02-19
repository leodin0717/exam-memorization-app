// 행정학 모드 앱 로직 (국가직 9급 중심)
(function () {
    'use strict';

    const EXAM_DATE = ADMIN_EXAM_DATE;
    const CHAPTERS = ADMIN_CHAPTERS;
    const WHAT_CARDS = ADMIN_WHAT_CARDS;
    const TRAP_PATTERNS = ADMIN_TRAP_PATTERNS;
    const BASE_QUESTIONS = Array.isArray(ADMIN_QUESTIONS) ? ADMIN_QUESTIONS : [];
    const SUPPLEMENT_QUESTIONS = Array.isArray(window.ADMIN_QUESTIONS_SUPPLEMENT) ? window.ADMIN_QUESTIONS_SUPPLEMENT : [];

    // TSV 기반 실전 반응카드/쌍둥이(최소대조) 데이터 (Anki export → JS bank)
    const TSV_OX_CARDS_RAW = Array.isArray(window.ADMIN_TSV_OX_CARDS) ? window.ADMIN_TSV_OX_CARDS : [];
    const TSV_COMPARE_CARDS_RAW = Array.isArray(window.ADMIN_TSV_COMPARE_CARDS) ? window.ADMIN_TSV_COMPARE_CARDS : [];

    const SLOW_THRESHOLD_SEC = 8;
    const REVIEW_TRIGGER_SCORE = 1.35;
    const CHALLENGE_TARGET_SCORE = 90;
    const CHALLENGE_TARGET_CORRECT = 18;
    const CHALLENGE_TIME_LIMIT_SEC = 17 * 60;

    const STORAGE = {
        history: 'admin_history_v2',
        streak: 'admin_streak_v2',
        meta: 'admin_meta_v2',
        training: 'admin_training_v1',
        cardHistory: 'admin_card_history_v1'
    };

    const WHAT_LABELS = {
        W: 'Who 학자',
        H: 'How 분류',
        A: 'Against 반대',
        T: 'Trap 함정'
    };

    const META_REASON_LABELS = {
        scholar: '학자·이론 주체',
        framework: '분류틀·비교축',
        contrast: '반대개념 변별',
        number: '숫자·기간',
        wording: '문구 함정',
        unknown: '개념 낯섦'
    };

    const FOCUS_TOPIC_KEYWORDS = [
        '뷰캐넌', '오스트롬', 'Salisbury', '모니터링', '행정협의회',
        '조세지출', '특별지방행정기관', '시장실패', '정부실패', '시보', '소청'
    ];

    const MEMORY_TIP_RULES = [
        { re: /시보|소청/, tip: '👶 5급은 1년 인턴, 6급 이하는 6개월 단기훈련 장면으로 묶어 기억하세요.' },
        { re: /조세지출|감면|공제|비과세/, tip: '🪣 세금통에 구멍(감면·공제)이 나 보조금처럼 새는 그림으로 각인하세요.' },
        { re: /행정협의회/, tip: '🤝 두 지자체가 한 원탁에 앉아 사무를 나눠 잡는 한 컷으로 떠올리세요.' },
        { re: /특별지방행정기관/, tip: '🏢 중앙정부 출장소가 지방에 깃발 꽂고 직접 집행하는 장면으로 기억하세요.' },
        { re: /모니터링|형성평가|총괄평가|정책평가/, tip: '🎥 집행 중엔 CCTV(모니터링), 끝나면 성적표(총괄)로 시간축을 고정하세요.' },
        { re: /뷰캐넌|공공선택/, tip: '🧮 정치도 시장처럼 계산하는 장부를 든 뷰캐넌을 떠올리면 바로 인출됩니다.' },
        { re: /오스트롬|공유자원/, tip: '🌾 마을 주민이 직접 규칙판을 들고 공유목초지를 지키는 장면으로 기억하세요.' },
        { re: /Salisbury|Lowi|Wilson/, tip: '🗂️ 분류 서랍 3개(Lowi·Wilson·Salisbury)를 나란히 여는 이미지로 고정하세요.' },
        { re: /데이터3법|전자정부/, tip: '💾 3개 USB(개보법·정보통신망법·신용정보법)를 하나의 정부 클라우드에 꽂는 장면으로 저장하세요.' },
        { re: /예산과정|예산편성|예산심의|결산/, tip: '🛤️ 편성→심의→집행→결산 네 칸 기차가 순서대로 지나가는 그림으로 암기하세요.' }
    ];

    const STATE = {
        currentPage: 'dashboard',
        studyQuestions: [],
        studyIndex: 0,
        studyAnswers: {},
        studyResponseSec: {},
        studyReveal: {},
        activeStudyQid: null,
        studyStartTs: 0,
        oxItems: [],
        oxIndex: 0,
        oxAnswers: {},
        oxResponseSec: {},
        activeOxQid: null,
        oxStartTs: 0,
        twinItems: [],
        twinIndex: 0,
        twinRevealed: false,
        challenge: {
            enabled: false,
            startedAtTs: 0,
            limitSec: CHALLENGE_TIME_LIMIT_SEC,
            targetCorrect: CHALLENGE_TARGET_CORRECT,
            modeLabel: '압축 17분'
        },
        challengeTimerId: null,
        autoNextTimerId: null,
        pressureTickerId: null,
        studyPressureBudgetSec: 0,
        oxPressureBudgetSec: 0,
        training: {
            speedMode: false,
            recallFirst: true
        },
        filters: { imp: 'all', chapter: 'all', sort: 'random', target: 'national9' },
        oxFilters: { imp: 'all', chapter: 'all', count: '20', target: 'national9', source: 'mix' },
        twinFilters: { imp: 'all', scope: 'core' },
        pendingMeta: null
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

    function escapeRegExp(str) { return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function loadJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function saveJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
    function loadHistory() { return loadJSON(STORAGE.history, {}); }
    function saveHistory(v) { saveJSON(STORAGE.history, v); }
    function loadCardHistory() { return loadJSON(STORAGE.cardHistory, {}); }
    function saveCardHistory(v) { saveJSON(STORAGE.cardHistory, v); }
    function loadStreak() { return loadJSON(STORAGE.streak, { count: 0, lastDate: '' }); }
    function saveStreak(v) { saveJSON(STORAGE.streak, v); }
    function loadMeta() { return loadJSON(STORAGE.meta, {}); }
    function saveMeta(v) { saveJSON(STORAGE.meta, v); }
    function loadTraining() { return loadJSON(STORAGE.training, { speedMode: false, recallFirst: true }); }
    function saveTraining(v) { saveJSON(STORAGE.training, v); }
    function logJournalAttempt(payload) {
        if (!window.StudyJournal || typeof window.StudyJournal.logAttempt !== 'function') return null;
        return window.StudyJournal.logAttempt(payload);
    }
    function appendJournalMeta(eventId, reasons, note) {
        if (!eventId) return;
        if (!window.StudyJournal || typeof window.StudyJournal.appendMeta !== 'function') return;
        window.StudyJournal.appendMeta(eventId, {
            metaReasons: reasons || [],
            note: note || ''
        });
    }

    function mergeQuestions() {
        const map = new Map();
        [...BASE_QUESTIONS, ...SUPPLEMENT_QUESTIONS].forEach(row => {
            if (!row || row.id === undefined || row.id === null) return;
            const q = { ...row };
            q.choices = (row.choices || []).map(c => ({
                ...c,
                what: c.what || ['H'],
                stamp: c.stamp || c.what || ['H'],
                keywords: c.keywords || []
            }));
            q.keywords = q.keywords || uniq(q.choices.flatMap(c => c.keywords || []));
            q.sourceCategory = q.sourceCategory || '국가직 기출/선별';
            map.set(Number(q.id), q);
        });
        return [...map.values()].sort((a, b) => a.id - b.id);
    }

    const QUESTIONS = mergeQuestions();
    const QUESTION_MAP = new Map(QUESTIONS.map(q => [q.id, q]));

    const TSV_DECK_RANK = {
        '반응카드v2': 5,
        '90점기출분석': 4,
        '확장카드1': 3,
        '확장카드2': 3,
        '갭보완': 2,
        '반응카드': 1
    };

    function normalizeSentenceKey(value) {
        return String(value || '')
            .replace(/\s+/g, ' ')
            .replace(/[“”]/g, '"')
            .replace(/[’]/g, "'")
            .trim();
    }

    function getTSVCardsByScope(scope) {
        const wantAll = scope === 'all';
        const list = TSV_OX_CARDS_RAW.filter(c => {
            if (!c || !c.sentence) return false;
            if (wantAll) return true;
            return c.scope === 'core';
        });

        // 중복 문장(반응카드 v1/v2/확장/90점) 제거: 기본은 '가장 품질 높은 덱' 우선
        const dedup = new Map();
        list.forEach(card => {
            const key = normalizeSentenceKey(card.sentence);
            if (!key) return;
            const prev = dedup.get(key);
            if (!prev) {
                dedup.set(key, card);
                return;
            }
            const prevRank = TSV_DECK_RANK[prev.deck] || 0;
            const nextRank = TSV_DECK_RANK[card.deck] || 0;
            const prevTip = String(prev.tip || '');
            const nextTip = String(card.tip || '');
            if (nextRank > prevRank || (nextRank === prevRank && nextTip.length > prevTip.length)) {
                dedup.set(key, card);
            }
        });

        return [...dedup.values()];
    }

    const TSV_OX_CARDS_CORE = getTSVCardsByScope('core');
    const TSV_OX_CARDS_ALL = getTSVCardsByScope('all');
    const TSV_CARD_MAP = new Map(TSV_OX_CARDS_ALL.map(c => [String(c.id), c]));

    const TSV_COMPARE_CARDS_CORE = TSV_COMPARE_CARDS_RAW.filter(c => c && c.scope === 'core');
    const TSV_COMPARE_CARDS_ALL = TSV_COMPARE_CARDS_RAW.filter(c => !!c);
    const TSV_TWIN_MAP = new Map(TSV_COMPARE_CARDS_ALL.map(c => [String(c.id), c]));

    function updateStreak() {
        const streak = loadStreak();
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (streak.lastDate === today) return streak.count;
        streak.count = streak.lastDate === yesterday ? streak.count + 1 : 1;
        streak.lastDate = today;
        saveStreak(streak);
        return streak.count;
    }

    function recordAnswer(key, correct, responseSec) {
        const h = loadHistory();
        if (!h[key]) h[key] = { attempts: 0, correct: 0, lastDate: '' };
        h[key].attempts += 1;
        if (correct) h[key].correct += 1;
        h[key].lastDate = new Date().toISOString().slice(0, 10);
        if (typeof responseSec === 'number' && Number.isFinite(responseSec)) {
            h[key].lastResponseSec = Number(responseSec.toFixed(1));
            h[key].totalResponseSec = Number(((h[key].totalResponseSec || 0) + responseSec).toFixed(1));
            h[key].avgResponseSec = Number((h[key].totalResponseSec / h[key].attempts).toFixed(1));
        }
        saveHistory(h);
    }

    function recordCardAnswer(key, correct, responseSec) {
        const h = loadCardHistory();
        if (!h[key]) h[key] = { attempts: 0, correct: 0, lastDate: '' };
        h[key].attempts += 1;
        if (correct) h[key].correct += 1;
        h[key].lastDate = new Date().toISOString().slice(0, 10);
        if (typeof responseSec === 'number' && Number.isFinite(responseSec)) {
            h[key].lastResponseSec = Number(responseSec.toFixed(1));
            h[key].totalResponseSec = Number(((h[key].totalResponseSec || 0) + responseSec).toFixed(1));
            h[key].avgResponseSec = Number((h[key].totalResponseSec / h[key].attempts).toFixed(1));
        }
        saveCardHistory(h);
    }

    function getTodayCount(history = null) {
        const h = history || loadHistory();
        const today = new Date().toISOString().slice(0, 10);
        return Object.values(h).filter(v => v.lastDate === today).length;
    }

    function parseQuestionIdFromHistoryKey(key) {
        const raw = String(key || '');
        const first = raw.split('_')[0];
        const id = Number(first);
        return Number.isFinite(id) ? id : null;
    }

    function getAccuracy(history, key) {
        const row = history[key];
        if (!row || !row.attempts) return 1;
        return row.correct / row.attempts;
    }

    function calcReviewPriority(q, history) {
        const row = history[String(q.id)];
        const attempts = row?.attempts || 0;
        const accuracy = attempts > 0 ? row.correct / attempts : 0;
        const avgSec = row?.avgResponseSec || 0;
        const impWeight = q.importance === 'S' ? 1.15 : (q.importance === 'A' ? 1.0 : 0.85);

        let score = 0;
        if (attempts === 0) {
            score += 2.4;
        } else {
            score += (1 - accuracy) * 2.2;
            if (row.correct === 0 && attempts >= 1) score += 0.7;
        }
        if (avgSec >= SLOW_THRESHOLD_SEC) {
            score += 0.55 + ((avgSec - SLOW_THRESHOLD_SEC) / 4);
        }
        if ((q.sourceCategory || '').includes('보충')) score += 0.25;
        return Number((score * impWeight).toFixed(3));
    }

    function calcCardReviewPriority(card, history) {
        const row = history[String(card.id)];
        const attempts = row?.attempts || 0;
        const accuracy = attempts > 0 ? row.correct / attempts : 0;
        const avgSec = row?.avgResponseSec || 0;
        const impWeight = card.importance === 'S' ? 1.18 : (card.importance === 'A' ? 1.0 : 0.88);

        let score = 0;
        if (attempts === 0) {
            score += 2.2;
        } else {
            score += (1 - accuracy) * 2.1;
            if (row.correct === 0 && attempts >= 1) score += 0.65;
        }
        if (avgSec >= SLOW_THRESHOLD_SEC) {
            score += 0.5 + ((avgSec - SLOW_THRESHOLD_SEC) / 4);
        }
        // 쌍둥이/문장트릭은 실점 직결 → 자동 가중
        const tag = String(card.tagsRaw || '');
        if (tag.includes('오답::쌍둥이혼동') || tag.includes('유형::비교카드')) score += 0.25;
        if (tag.includes('오답::문장트릭')) score += 0.2;
        if (String(card.deck || '').includes('90점')) score += 0.15;
        return Number((score * impWeight).toFixed(3));
    }

    function calcDday() {
        const exam = new Date(EXAM_DATE);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        exam.setHours(0, 0, 0, 0);
        return Math.ceil((exam - now) / 86400000);
    }

    function isNational9(q) {
        const exam = String(q.exam || '');
        return exam.includes('국가직');
    }

    function getScopeQuestions(target) {
        if (target === 'all') return QUESTIONS;
        return QUESTIONS.filter(isNational9);
    }

    function getScopeTSVCards(target) {
        return target === 'all' ? TSV_OX_CARDS_ALL : TSV_OX_CARDS_CORE;
    }

    function getScopeTwinCards(scope) {
        return scope === 'all' ? TSV_COMPARE_CARDS_ALL : TSV_COMPARE_CARDS_CORE;
    }

    function getChallengePreset() {
        const sel = document.getElementById('challengePreset');
        const raw = sel ? parseInt(sel.value, 10) : 17;
        const minutes = Number.isFinite(raw) ? Math.max(15, Math.min(20, raw)) : 17;
        const label = minutes === 15 ? '초압축 15분'
            : minutes === 18 ? '압축 18분'
                : minutes === 20 ? '표준 20분'
                    : '압축 17분';
        return { minutes, limitSec: minutes * 60, label };
    }

    function syncChallengeButtonLabel() {
        const btn = document.getElementById('startChallenge');
        if (!btn) return;
        const preset = getChallengePreset();
        btn.textContent = `🏁 ${preset.label} 챌린지(20문)`;
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

    function clearChallengeTicker() {
        if (STATE.challengeTimerId) {
            clearInterval(STATE.challengeTimerId);
            STATE.challengeTimerId = null;
        }
    }

    function clearAutoNext() {
        if (STATE.autoNextTimerId) {
            clearTimeout(STATE.autoNextTimerId);
            STATE.autoNextTimerId = null;
        }
    }

    function getChallengeElapsedSec() {
        if (!STATE.challenge.enabled || !STATE.challenge.startedAtTs) return 0;
        return Math.max(0, (performance.now() - STATE.challenge.startedAtTs) / 1000);
    }

    function resetStudySession() {
        clearAutoNext();
        clearPressureTicker();
        STATE.studyIndex = 0;
        STATE.studyAnswers = {};
        STATE.studyResponseSec = {};
        STATE.studyReveal = {};
        STATE.activeStudyQid = null;
        STATE.studyStartTs = 0;
        STATE.studyPressureBudgetSec = 0;
    }

    function showStudyScreen() {
        document.querySelector('#page-study .filter-panel').style.display = 'none';
        document.getElementById('studyArea').style.display = 'block';
    }

    function setupNav() {
        document.getElementById('navTabs').addEventListener('click', e => {
            const tab = e.target.closest('.nav-tab');
            if (!tab) return;
            switchPage(tab.dataset.page);
        });
    }

    function switchPage(page) {
        if (page !== 'study' && STATE.challenge.enabled) {
            clearChallengeTicker();
            STATE.challenge.enabled = false;
            STATE.challenge.startedAtTs = 0;
            renderChallengeStatus();
        }
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
        document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + page));
        if (page === 'study' && STATE.studyQuestions.length > 0 && document.getElementById('studyArea').style.display !== 'none') {
            renderQuestion();
        }
        if (page === 'ox' && STATE.oxItems.length > 0 && document.getElementById('oxArea').style.display !== 'none') {
            renderOX();
        }
        if (page === 'dashboard') renderDashboard();
        if (page === 'what') renderWHAT();
        if (page === 'weak') {
            renderMetaInsights();
            renderWeakAnalysis();
        }
        if (page === 'guide') renderGuide();
    }

    function setupSubjectSwitch() {
        const el = document.getElementById('subjectSwitch');
        if (!el) return;
        el.value = 'admin';
        el.addEventListener('change', e => {
            const value = e.target.value;
            if (value === 'law') {
                window.location.href = 'index.html';
                return;
            }
            if (value === 'his') {
                window.location.href = 'history.html';
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
        link.href = 'journal.html?subject=admin';
    }

    function setupFilters() {
        document.addEventListener('click', e => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            const { filter, value } = btn.dataset;
            if (filter === 'imp') STATE.filters.imp = value;
            if (filter === 'ox-imp') STATE.oxFilters.imp = value;
            btn.parentElement.querySelectorAll('.filter-btn').forEach(b => {
                if (b.dataset.filter === filter) b.classList.toggle('active', b.dataset.value === value);
            });
            updateFilteredCounts();
        });

        document.addEventListener('click', e => {
            const reviewBtn = e.target.closest('[data-action="start-review-queue"]');
            if (reviewBtn) startReviewQueue();

            const cardReviewBtn = e.target.closest('[data-action="start-card-review-queue"]');
            if (cardReviewBtn) startCardReviewQueue();
        });

        document.getElementById('chapterFilter').addEventListener('change', e => {
            STATE.filters.chapter = e.target.value;
            updateFilteredCounts();
        });

        document.getElementById('sortOrder').addEventListener('change', e => {
            STATE.filters.sort = e.target.value;
            updateFilteredCounts();
        });

        document.getElementById('targetFilter').addEventListener('change', e => {
            STATE.filters.target = e.target.value;
            updateFilteredCounts();
        });

        document.getElementById('oxChapterFilter').addEventListener('change', e => {
            STATE.oxFilters.chapter = e.target.value;
            updateFilteredCounts();
        });

        const oxSourceFilter = document.getElementById('oxSourceFilter');
        if (oxSourceFilter) {
            oxSourceFilter.addEventListener('change', e => {
                STATE.oxFilters.source = e.target.value;
                updateFilteredCounts();
            });
        }

        document.getElementById('oxCount').addEventListener('change', e => {
            STATE.oxFilters.count = e.target.value;
            updateFilteredCounts();
        });

        document.getElementById('oxTargetFilter').addEventListener('change', e => {
            STATE.oxFilters.target = e.target.value;
            updateFilteredCounts();
        });

        const challengePreset = document.getElementById('challengePreset');
        if (challengePreset) {
            challengePreset.addEventListener('change', syncChallengeButtonLabel);
        }
        const speedModeToggle = document.getElementById('speedModeToggle');
        if (speedModeToggle) {
            speedModeToggle.addEventListener('change', applyTrainingOptionsFromUI);
        }
        const recallModeToggle = document.getElementById('recallModeToggle');
        if (recallModeToggle) {
            recallModeToggle.addEventListener('change', applyTrainingOptionsFromUI);
        }

        document.getElementById('startStudy').addEventListener('click', startStudy);
        document.getElementById('startChallenge').addEventListener('click', startChallenge);
        document.getElementById('startOX').addEventListener('click', startOX);
        document.getElementById('prevQ').addEventListener('click', () => navStudy(-1));
        document.getElementById('nextQ').addEventListener('click', () => navStudy(1));
        document.getElementById('prevOX').addEventListener('click', () => navOX(-1));
        document.getElementById('nextOX').addEventListener('click', () => navOX(1));

        // Twin trainer (WHAT page)
        const twinImp = document.getElementById('twinImpFilter');
        const twinScope = document.getElementById('twinScopeFilter');
        const startTwinBtn = document.getElementById('startTwin');
        const prevTwin = document.getElementById('prevTwin');
        const nextTwin = document.getElementById('nextTwin');

        if (twinImp) twinImp.addEventListener('change', e => { STATE.twinFilters.imp = e.target.value; });
        if (twinScope) twinScope.addEventListener('change', e => { STATE.twinFilters.scope = e.target.value; });
        if (startTwinBtn) startTwinBtn.addEventListener('click', startTwinTrainer);
        if (prevTwin) prevTwin.addEventListener('click', () => navTwin(-1));
        if (nextTwin) nextTwin.addEventListener('click', () => navTwin(1));
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', e => {
            if (STATE.currentPage === 'study' && document.getElementById('studyArea').style.display !== 'none') {
                if (e.key >= '1' && e.key <= '4') {
                    const q = STATE.studyQuestions[STATE.studyIndex];
                    if (q) window._selectChoice(q.id, Number(e.key));
                }
                if (e.key === 'ArrowLeft') navStudy(-1);
                if (e.key === 'ArrowRight') navStudy(1);
            }

            if (STATE.currentPage === 'ox' && document.getElementById('oxArea').style.display !== 'none') {
                if (e.key === 'o' || e.key === 'O') window._selectOX(STATE.oxItems[STATE.oxIndex]?.qid, true);
                if (e.key === 'x' || e.key === 'X') window._selectOX(STATE.oxItems[STATE.oxIndex]?.qid, false);
                if (e.key === 'ArrowLeft') navOX(-1);
                if (e.key === 'ArrowRight') navOX(1);
            }

            if (STATE.currentPage === 'what') {
                const twinArea = document.getElementById('twinArea');
                if (twinArea && twinArea.style.display !== 'none' && STATE.twinItems.length) {
                    if (e.key === 'ArrowLeft') navTwin(-1);
                    if (e.key === 'ArrowRight') navTwin(1);
                    if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        toggleTwinReveal();
                    }
                }
            }
        });
    }

    function populateChapterSelects() {
        const used = Object.keys(CHAPTERS).filter(ch =>
            QUESTIONS.some(q => q.chapter === ch)
            || TSV_OX_CARDS_ALL.some(c => c.chapter === ch)
            || TSV_COMPARE_CARDS_ALL.some(t => t.chapter === ch)
        );
        [document.getElementById('chapterFilter'), document.getElementById('oxChapterFilter')].forEach(sel => {
            used.forEach(ch => {
                const opt = document.createElement('option');
                opt.value = ch;
                opt.textContent = CHAPTERS[ch] || ch;
                sel.appendChild(opt);
            });
        });
    }

    function getFilteredQuestions() {
        let qs = getScopeQuestions(STATE.filters.target).filter(q => {
            if (STATE.filters.imp !== 'all' && q.importance !== STATE.filters.imp) return false;
            if (STATE.filters.chapter !== 'all' && q.chapter !== STATE.filters.chapter) return false;
            return true;
        });

        const history = loadHistory();
        if (STATE.filters.sort === 'random') qs = shuffle(qs);
        if (STATE.filters.sort === 'importance') qs.sort((a, b) => 'SAB'.indexOf(a.importance) - 'SAB'.indexOf(b.importance));
        if (STATE.filters.sort === 'weak') qs.sort((a, b) => getAccuracy(history, a.id) - getAccuracy(history, b.id));
        if (STATE.filters.sort === 'review') qs.sort((a, b) => calcReviewPriority(b, history) - calcReviewPriority(a, history));
        if (STATE.filters.sort === 'year-desc') qs.sort((a, b) => b.year - a.year);
        return qs;
    }

    function toOXItem(q, i) {
        const ox = generateAdminOXFromChoice(q, i);
        return {
            qid: `${ox.questionId}_${ox.choiceNum}`,
            bank: 'choice',
            sourceQ: q,
            statement: ox.text,
            answer: ox.answer,
            chapter: ox.chapter,
            importance: ox.importance,
            topic: ox.topic,
            what: ox.what || [],
            stamp: ox.stamp || ox.what || [],
            keywords: ox.keywords || [],
            year: ox.year,
            exam: ox.exam,
            sourceCategory: ox.sourceCategory || ''
        };
    }

    function toTSVOXItem(card) {
        return {
            qid: String(card.id),
            bank: 'tsv',
            card,
            statement: card.sentence,
            answer: !!card.answer,
            chapter: card.chapter || 'CH01',
            importance: card.importance || 'A',
            topic: card.theme || 'TSV',
            what: [card.stamp || 'H'],
            stamp: [card.stamp || 'H'],
            keywords: card.keywords || [],
            year: card.year || '',
            exam: card.exam || 'TSV',
            sourceCategory: card.deck || 'TSV'
        };
    }

    function getFilteredOX() {
        const source = STATE.oxFilters.source || 'mix';
        let items = [];

        const wantChoice = source === 'choice' || source === 'mix';
        const wantTSV = source === 'tsv' || source === 'mix';

        if (wantChoice) {
            getScopeQuestions(STATE.oxFilters.target).forEach(q => {
                if (STATE.oxFilters.imp !== 'all' && q.importance !== STATE.oxFilters.imp) return;
                if (STATE.oxFilters.chapter !== 'all' && q.chapter !== STATE.oxFilters.chapter) return;
                q.choices.forEach((_, i) => items.push(toOXItem(q, i)));
            });
        }

        if (wantTSV) {
            getScopeTSVCards(STATE.oxFilters.target).forEach(card => {
                if (STATE.oxFilters.imp !== 'all' && card.importance !== STATE.oxFilters.imp) return;
                if (STATE.oxFilters.chapter !== 'all' && card.chapter !== STATE.oxFilters.chapter) return;
                items.push(toTSVOXItem(card));
            });
        }

        items = shuffle(items);
        const max = STATE.oxFilters.count === 'all' ? items.length : parseInt(STATE.oxFilters.count, 10);
        return items.slice(0, max);
    }

    function updateFilteredCounts() {
        document.getElementById('filteredCount').textContent = `(${getFilteredQuestions().length}문항 선택됨)`;
        document.getElementById('oxFilteredCount').textContent = `(${getFilteredOX().length}문항 생성됨)`;
    }

    function buildReviewStats() {
        const history = loadHistory();
        const core = getScopeQuestions('national9');

        let unseenS = 0;
        let weakCore = 0;
        let slowCore = 0;
        let dueReview = 0;

        core.forEach(q => {
            const row = history[String(q.id)];
            if (q.importance === 'S' && !row) unseenS += 1;
            if (row && row.attempts >= 2 && (row.correct / row.attempts) < 0.7) weakCore += 1;
            if (row && row.avgResponseSec >= SLOW_THRESHOLD_SEC) slowCore += 1;
            if (calcReviewPriority(q, history) >= REVIEW_TRIGGER_SCORE) dueReview += 1;
        });

        return { unseenS, weakCore, slowCore, dueReview };
    }

    function buildCardReviewStats(target = 'national9') {
        const history = loadCardHistory();
        const core = getScopeTSVCards(target);

        let unseenS = 0;
        let weakCore = 0;
        let slowCore = 0;
        let dueReview = 0;

        core.forEach(card => {
            const row = history[String(card.id)];
            if (card.importance === 'S' && !row) unseenS += 1;
            if (row && row.attempts >= 2 && (row.correct / row.attempts) < 0.7) weakCore += 1;
            if (row && row.avgResponseSec >= SLOW_THRESHOLD_SEC) slowCore += 1;
            if (calcCardReviewPriority(card, history) >= REVIEW_TRIGGER_SCORE) dueReview += 1;
        });

        return { unseenS, weakCore, slowCore, dueReview, total: core.length };
    }

    function renderReviewBoard() {
        const el = document.getElementById('reviewBoard');
        if (!el) return;
        const stats = buildReviewStats();
        const cardStats = buildCardReviewStats('national9');
        const combined = {
            unseenS: stats.unseenS + cardStats.unseenS,
            weakCore: stats.weakCore + cardStats.weakCore,
            slowCore: stats.slowCore + cardStats.slowCore,
            dueReview: stats.dueReview + cardStats.dueReview
        };
        el.innerHTML = `
            <div class="review-card">
                <div class="review-label">S급 미학습</div>
                <div class="review-value">${combined.unseenS}문항</div>
                <div class="review-sub">객관식 ${stats.unseenS} · 카드 ${cardStats.unseenS}</div>
            </div>
            <div class="review-card">
                <div class="review-label">오답 누적</div>
                <div class="review-value">${combined.weakCore}문항</div>
                <div class="review-sub">객관식 ${stats.weakCore} · 카드 ${cardStats.weakCore} (정확도 70% 미만)</div>
            </div>
            <div class="review-card">
                <div class="review-label">느린 문항</div>
                <div class="review-value">${combined.slowCore}문항</div>
                <div class="review-sub">객관식 ${stats.slowCore} · 카드 ${cardStats.slowCore} (평균 ${SLOW_THRESHOLD_SEC}초↑)</div>
            </div>
            <div class="review-card">
                <div class="review-label">오늘 복습 큐</div>
                <div class="review-value">${combined.dueReview}문항</div>
                <div class="review-sub">객관식 ${stats.dueReview} · 카드 ${cardStats.dueReview}</div>
                <div class="review-actions">
                    <button class="review-btn" data-action="start-review-queue">객관식</button>
                    <button class="review-btn" data-action="start-card-review-queue">카드</button>
                </div>
            </div>
        `;
    }

    function renderNinetyCoach() {
        const el = document.getElementById('ninetyCoach');
        if (!el) return;

        const history = loadHistory();
        let coreAttempts = 0;
        let coreCorrect = 0;
        Object.entries(history).forEach(([key, row]) => {
            const qid = parseQuestionIdFromHistoryKey(key);
            if (!qid) return;
            const q = QUESTION_MAP.get(qid);
            if (!q || !isNational9(q)) return;
            coreAttempts += (row.attempts || 0);
            coreCorrect += (row.correct || 0);
        });

        const predictedCorrect = coreAttempts ? Math.round((coreCorrect / coreAttempts) * 20) : 0;
        const predictedScore = predictedCorrect * 5;
        const gap = Math.max(0, CHALLENGE_TARGET_CORRECT - predictedCorrect);
        const progressPct = Math.max(0, Math.min(100, Math.round((predictedCorrect / CHALLENGE_TARGET_CORRECT) * 100)));
        const preset = getChallengePreset();

        const stats = buildReviewStats();
        const cardStats = buildCardReviewStats('national9');
        const cardHistory = loadCardHistory();
        const coreCards = getScopeTSVCards('national9');
        const sCards = coreCards.filter(c => c.importance === 'S');
        const sDone = sCards.filter(c => !!cardHistory[String(c.id)]).length;
        const sPct = sCards.length ? Math.round((sDone / sCards.length) * 100) : 0;
        const twinCount = getScopeTwinCards('core').length;
        const chips = [
            `목표까지 ${gap}문항`,
            `복습 큐 ${stats.dueReview}문항`,
            `느린 문항 ${stats.slowCore}문항`,
            `카드 S급 ${sPct}% (${sDone}/${sCards.length || 0})`,
            `카드 큐 ${cardStats.dueReview}문항`,
            `쌍둥이 ${twinCount}세트`,
            `압축훈련 ${preset.label}`
        ];

        el.innerHTML = `
            <div class="coach-head">
                <div>
                    <div class="coach-score">예상 ${predictedScore}점 (${predictedCorrect}/20)</div>
                    <div class="coach-goal">목표: ${CHALLENGE_TARGET_SCORE}점 이상 (${CHALLENGE_TARGET_CORRECT}개 정답)</div>
                </div>
                <button class="review-btn" data-action="start-review-queue">복습 시작</button>
            </div>
            <div class="coach-progress"><div class="coach-fill" style="width:${progressPct}%"></div></div>
            <div class="coach-actions">${chips.map(t => `<span class="coach-chip">${escapeHtml(t)}</span>`).join('')}</div>
        `;
    }

    function renderSourceAudit() {
        const el = document.getElementById('sourceAudit');
        if (!el) return;

        const bankQ = QUESTIONS.map(q => [
            q.topic,
            q.question,
            ...(q.keywords || []),
            ...q.choices.map(c => c.text),
            ...q.choices.flatMap(c => c.keywords || [])
        ].join(' ')).join(' ');

        const bankCards = TSV_OX_CARDS_RAW.map(c => [
            c.theme,
            c.sentence,
            c.trigger,
            c.rule,
            c.confusion,
            c.conclusion,
            c.tip,
            c.source,
            ...(c.keywords || [])
        ].join(' ')).join(' ');

        const bankTwins = TSV_COMPARE_CARDS_RAW.map(t => [
            t.conceptA,
            t.conceptB,
            ...(t.axes || []),
            t.tip,
            t.source
        ].join(' ')).join(' ');

        const bank = `${bankQ} ${bankCards} ${bankTwins}`;
        const lowCoverage = FOCUS_TOPIC_KEYWORDS.map(k => ({ key: k, count: (bank.match(new RegExp(escapeRegExp(k), 'g')) || []).length }))
            .filter(x => x.count <= 1)
            .sort((a, b) => a.count - b.count)
            .slice(0, 6);

        const bySource = QUESTIONS.reduce((acc, q) => {
            const key = (q.sourceCategory || '기출/선별').replace(/\s+/g, ' ');
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        const byDeck = TSV_OX_CARDS_RAW.reduce((acc, c) => {
            const key = `카드·${(c.deck || 'TSV').replace(/\s+/g, ' ')}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        const byTwin = TSV_COMPARE_CARDS_RAW.reduce((acc, t) => {
            const key = `쌍둥이·${(t.deck || '비교프레임').replace(/\s+/g, ' ')}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        const mergedSources = { ...bySource, ...byDeck, ...byTwin };

        const sourceRows = Object.entries(mergedSources)
            .sort((a, b) => b[1] - a[1])
            .map(([name, cnt]) => `<div class="audit-row"><span>${escapeHtml(name)}</span><strong>${cnt}문항</strong></div>`)
            .join('');

        const lowRows = lowCoverage.length
            ? lowCoverage.map(x => `<div class="audit-row"><span>핵심키워드: ${escapeHtml(x.key)}</span><strong>${x.count}회</strong></div>`).join('')
            : '<div class="audit-row"><span>핵심키워드 최소빈도</span><strong>모두 2회 이상</strong></div>';

        const totalMCQ = QUESTIONS.length;
        const totalCards = TSV_OX_CARDS_RAW.length;
        const totalTwins = TSV_COMPARE_CARDS_RAW.length;
        const totalAll = totalMCQ + totalCards + totalTwins;
        el.innerHTML = `
            <div class="audit-row"><span>총 데이터 (객관식+반응카드+쌍둥이)</span><strong>${totalAll}개</strong></div>
            <div class="audit-row"><span>객관식</span><strong>${totalMCQ}문항</strong></div>
            <div class="audit-row"><span>반응카드 OX (TSV)</span><strong>${totalCards}문장</strong></div>
            <div class="audit-row"><span>쌍둥이 프레임</span><strong>${totalTwins}세트</strong></div>
            <div class="audit-row"><span>국가직(객관식)</span><strong>${getScopeQuestions('national9').length}문항</strong></div>
            ${sourceRows}
            ${lowRows}
        `;
    }

    function renderDashboard() {
        const h = loadHistory();
        const ch = loadCardHistory();
        const answeredSet = new Set();
        Object.keys(h).forEach(key => {
            const qid = parseQuestionIdFromHistoryKey(key);
            if (qid && QUESTION_MAP.has(qid)) answeredSet.add(qid);
        });
        const totalAnswered = answeredSet.size;
        const totalCorrect = Object.values(h).reduce((sum, row) => sum + row.correct, 0);
        const totalAttempts = Object.values(h).reduce((sum, row) => sum + row.attempts, 0);
        const acc = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

        const cardAnsweredSet = new Set(Object.keys(ch).filter(k => TSV_CARD_MAP.has(String(k))));
        const cardAnswered = cardAnsweredSet.size;
        const cardCorrect = Object.values(ch).reduce((sum, row) => sum + (row.correct || 0), 0);
        const cardAttempts = Object.values(ch).reduce((sum, row) => sum + (row.attempts || 0), 0);
        const cardAcc = cardAttempts > 0 ? Math.round((cardCorrect / cardAttempts) * 100) : 0;

        const totalBank = QUESTIONS.length + getScopeTSVCards('national9').length;
        const totalDone = totalAnswered + cardAnswered;

        const statTotalEl = document.getElementById('statTotal');
        const statAccEl = document.getElementById('statAccuracy');
        const statTodayEl = document.getElementById('statToday');

        statTotalEl.textContent = `${totalDone} / ${totalBank}`;
        statTotalEl.title = `객관식 ${totalAnswered}/${QUESTIONS.length} · 카드 ${cardAnswered}/${getScopeTSVCards('national9').length}`;

        statAccEl.textContent = totalAttempts > 0 ? `${acc}%` : '--%';
        statAccEl.title = `카드 정답률: ${cardAttempts > 0 ? cardAcc + '%' : '--%'}`;

        const todayQ = getTodayCount(h);
        const todayC = getTodayCount(ch);
        statTodayEl.textContent = todayQ + todayC;
        statTodayEl.title = `객관식 ${todayQ} · 카드 ${todayC}`;
        document.getElementById('statStreak').textContent = loadStreak().count;

        renderReviewBoard();
        renderNinetyCoach();
        renderSourceAudit();
        renderChapterGrid();
    }

    function renderChapterGrid() {
        const h = loadHistory();
        const ch = loadCardHistory();
        const grid = document.getElementById('chapterGrid');
        const chapterData = {};
        const doneIds = new Set();
        const doneCardIds = new Set();

        Object.keys(h).forEach(key => {
            const qid = parseQuestionIdFromHistoryKey(key);
            if (qid && QUESTION_MAP.has(qid)) doneIds.add(qid);
        });

        Object.keys(ch).forEach(key => {
            const id = String(key);
            if (TSV_CARD_MAP.has(id)) doneCardIds.add(id);
        });

        QUESTIONS.forEach(q => {
            if (!chapterData[q.chapter]) chapterData[q.chapter] = { total: 0, done: 0 };
            chapterData[q.chapter].total += 1;
            if (doneIds.has(q.id)) chapterData[q.chapter].done += 1;
        });

        // TSV 반응카드(국가직9급 중심)도 챕터 진행률에 포함
        getScopeTSVCards('national9').forEach(card => {
            const chKey = card.chapter || 'CH01';
            if (!chapterData[chKey]) chapterData[chKey] = { total: 0, done: 0 };
            chapterData[chKey].total += 1;
            if (doneCardIds.has(String(card.id))) chapterData[chKey].done += 1;
        });

        const html = Object.keys(CHAPTERS).map(ch => {
            const d = chapterData[ch] || { total: 0, done: 0 };
            const pct = d.total > 0 ? Math.round((d.done / d.total) * 100) : 0;
            return `<div class="chapter-card">
                <div class="ch-name">${escapeHtml(CHAPTERS[ch])}</div>
                <div class="ch-bar"><div class="ch-fill" style="width:${pct}%"></div></div>
                <div class="ch-stats"><span>${d.done}/${d.total} 완료</span><span>${pct}%</span></div>
            </div>`;
        }).join('');

        grid.innerHTML = html;
    }

    function getElapsedSec(startTs) {
        if (!startTs) return 0;
        const elapsedMs = performance.now() - startTs;
        return Number(Math.max(0, elapsedMs / 1000).toFixed(1));
    }

    function speedLabel(sec) {
        if (sec >= SLOW_THRESHOLD_SEC) return '느림';
        if (sec >= 4) return '보통';
        return '빠름';
    }

    function getPressureBudgetSec(mode, importance) {
        let base = mode === 'study'
            ? (STATE.training.speedMode ? 17 : 26)
            : (STATE.training.speedMode ? 6 : 8);
        if (importance === 'S') base += mode === 'study' ? 2 : 1;
        if (importance === 'B') base -= 1;
        if (mode === 'study' && STATE.challenge.enabled) base = Math.min(base, 20);
        const min = mode === 'study' ? 13 : 4;
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

    function highlightByKeywords(text, stamps, keywords) {
        let result = escapeHtml(text);
        const list = uniq((keywords || []).filter(Boolean)).sort((a, b) => b.length - a.length);
        if (!list.length) return result;

        const stamp = (stamps && stamps.length ? stamps[0] : 'H');
        const cls = `what-${stamp}`;
        list.forEach(kw => {
            const re = new RegExp(`(${escapeRegExp(kw)})`, 'g');
            result = result.replace(re, `<span class="${cls}">$1</span>`);
        });
        return result;
    }

    function collectKeywordStampsFromQuestion(q) {
        const map = new Map();
        q.choices.forEach(c => {
            const stamps = (c.stamp && c.stamp.length ? c.stamp : (c.what || ['H']));
            const stamp = stamps[0] || 'H';
            (c.keywords || []).forEach(kw => {
                if (!map.has(kw)) map.set(kw, stamp);
            });
        });
        (q.keywords || []).forEach(kw => {
            if (!map.has(kw)) map.set(kw, 'H');
        });
        return map;
    }

    function renderKeywordChips(keywordMap, importance) {
        return [...keywordMap.entries()].slice(0, 20).map(([kw, stamp]) => (
            `<span class="what-tag what-tag-${stamp}">${escapeHtml(kw)} · ${importance}</span>`
        )).join('');
    }

    function buildRecallCue(q) {
        const correctChoice = q.choices.find(c => c.num === q.answer);
        const priorityKeywords = uniq([
            ...(correctChoice?.keywords || []),
            ...(q.keywords || [])
        ]).filter(Boolean).slice(0, 3);
        const what = (correctChoice?.what || [])[0];
        const whatLabel = what ? (WHAT_LABELS[what] || what) : '핵심개념';
        if (priorityKeywords.length) {
            return `핵심어 ${priorityKeywords.join(' · ')} | 함정축: ${whatLabel}`;
        }
        return `${escapeHtml(q.topic)}의 정답 근거를 한 문장으로 먼저 말해보세요.`;
    }

    function pickTipMode(historyKey, responseSec = 0) {
        const row = loadHistory()[historyKey] || {};
        const wrong = Math.max(0, (row.attempts || 0) - (row.correct || 0));
        if (wrong >= 2 || responseSec >= (SLOW_THRESHOLD_SEC + 1)) return 'chant';
        if (STATE.training.speedMode) return 'ultra';
        return 'image';
    }

    function tipModeLabel(mode) {
        if (mode === 'ultra') return '초압축형';
        if (mode === 'chant') return '암송형';
        return '이미지형';
    }

    function buildMemoryTip(q, context = {}) {
        const bag = [q.topic, q.question, ...(q.keywords || []), ...q.choices.flatMap(c => c.keywords || [])].join(' ');
        const rule = MEMORY_TIP_RULES.find(r => r.re.test(bag));
        const k1 = (q.keywords || [])[0] || q.topic;
        const k2 = (q.keywords || [])[1] || '핵심판단';
        const mode = context.mode || pickTipMode(context.historyKey || '', context.responseSec || 0);
        if (mode === 'ultra') {
            return { mode, label: tipModeLabel(mode), text: `⚡ ${k1}→${k2}만 고정하고 5초 내 즉답으로 인출하세요.` };
        }
        if (mode === 'chant') {
            return { mode, label: tipModeLabel(mode), text: `🗣️ "${k1}면 ${k2}"를 3회 암송 후 바로 재풀이해 고정하세요.` };
        }
        if (rule) return { mode, label: tipModeLabel(mode), text: rule.tip };
        return { mode, label: tipModeLabel(mode), text: `🧠 ${k1}와 ${k2}를 한 장면으로 묶어 '왜 정답인지'를 5초 내 말로 재생하세요.` };
    }

    function renderAnswerPanel(q, isCorrect, responseSec) {
        const correctChoice = q.choices.find(c => c.num === q.answer) || null;
        const whatTags = (correctChoice?.what || []).map(w => (
            `<span class="what-tag what-tag-${w}">${WHAT_LABELS[w] || w}</span>`
        )).join('');

        const keywordMap = collectKeywordStampsFromQuestion(q);
        const keywordChips = renderKeywordChips(keywordMap, q.importance);
        const memoryTip = buildMemoryTip(q, { historyKey: String(q.id), responseSec });

        return `<div class="answer-panel ${isCorrect ? 'correct' : 'incorrect'}">
            <div class="answer-result">${isCorrect ? '✅ 정답!' : `❌ 오답 — 정답: ${q.answer}번`}</div>
            <div class="answer-explain">⏱ 선택시간 ${responseSec.toFixed(1)}초 (${speedLabel(responseSec)})</div>
            <div class="answer-explain">📌 ${escapeHtml(q.topic)} | ${escapeHtml(CHAPTERS[q.chapter] || q.chapter)} | ${q.year} ${escapeHtml(q.exam)}</div>
            <div class="answer-explain">출처: ${escapeHtml(q.sourceCategory || '국가직 기출/선별')}</div>
            <div class="memory-tip"><span class="memory-tip-mode">${escapeHtml(memoryTip.label)}</span>${escapeHtml(memoryTip.text)}</div>
            ${whatTags ? `<div class="what-tags">${whatTags}</div>` : ''}
            ${keywordChips ? `<div class="what-tags">${keywordChips}</div>` : ''}
        </div>`;
    }

    function startStudy() {
        clearChallengeTicker();
        STATE.challenge.enabled = false;
        STATE.challenge.startedAtTs = 0;
        hidePressureTimer('ox');

        STATE.studyQuestions = getFilteredQuestions();
        resetStudySession();
        if (!STATE.studyQuestions.length) return alert('필터 조건에 맞는 문항이 없습니다.');

        showStudyScreen();
        renderChallengeStatus();
        renderQuestion();
    }

    function pickChallengeQuestions() {
        const core = getScopeQuestions('national9');
        const history = loadHistory();
        const sorted = shuffle(core).sort((a, b) => calcReviewPriority(b, history) - calcReviewPriority(a, history));
        const high = sorted.filter(q => q.importance !== 'B');
        const pool = [...high, ...sorted];
        const picked = [];
        pool.forEach(q => {
            if (picked.length >= 20) return;
            if (picked.some(x => x.id === q.id)) return;
            picked.push(q);
        });
        return picked;
    }

    function startChallenge() {
        const preset = getChallengePreset();
        clearChallengeTicker();
        hidePressureTimer('ox');
        STATE.challenge.enabled = true;
        STATE.challenge.startedAtTs = performance.now();
        STATE.challenge.limitSec = preset.limitSec;
        STATE.challenge.targetCorrect = CHALLENGE_TARGET_CORRECT;
        STATE.challenge.modeLabel = preset.label;

        STATE.studyQuestions = pickChallengeQuestions();
        resetStudySession();

        if (STATE.studyQuestions.length < 20) {
            alert('챌린지 구성을 위한 문항이 부족합니다. 일반 학습으로 진행합니다.');
            STATE.challenge.enabled = false;
            return startStudy();
        }

        showStudyScreen();
        startChallengeTicker();
        renderChallengeStatus();
        renderQuestion();
    }

    function startChallengeTicker() {
        clearChallengeTicker();
        STATE.challengeTimerId = setInterval(() => {
            if (!STATE.challenge.enabled) return;
            const elapsed = getChallengeElapsedSec();
            if (elapsed >= STATE.challenge.limitSec) {
                showStudyResult({ timedOut: true });
                return;
            }
            renderChallengeStatus();
        }, 1000);
    }

    function renderChallengeStatus() {
        const el = document.getElementById('challengeStatus');
        if (!el) return;
        if (!STATE.challenge.enabled) {
            el.style.display = 'none';
            el.className = 'challenge-status';
            el.textContent = '';
            return;
        }

        const answered = Object.keys(STATE.studyAnswers).length;
        const correct = STATE.studyQuestions.reduce((sum, q) => sum + (STATE.studyAnswers[q.id] === q.answer ? 1 : 0), 0);
        const wrong = answered - correct;
        const maxReachable = correct + (20 - answered);
        const elapsed = getChallengeElapsedSec();
        const remain = Math.max(0, STATE.challenge.limitSec - elapsed);
        const min = Math.floor(remain / 60);
        const sec = Math.floor(remain % 60);

        let cls = 'challenge-status';
        if (remain <= 300) cls += ' warning';
        if (remain <= 120 || maxReachable < STATE.challenge.targetCorrect) cls += ' danger';
        el.className = cls;
        el.style.display = 'block';
        const failHint = maxReachable < STATE.challenge.targetCorrect ? ' | 목표 도달 불가(재시작 권장)' : '';
        el.textContent = `🏁 ${STATE.challenge.modeLabel} | 진행 ${answered}/20 | 정답 ${correct}/${STATE.challenge.targetCorrect} | 오답 ${wrong} | 남은시간 ${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}${failHint}`;
    }

    function startReviewQueue() {
        clearChallengeTicker();
        STATE.challenge.enabled = false;
        STATE.challenge.startedAtTs = 0;
        hidePressureTimer('ox');
        switchPage('study');
        STATE.filters.target = 'national9';
        STATE.filters.sort = 'review';
        STATE.filters.chapter = 'all';
        STATE.filters.imp = 'all';

        const sort = document.getElementById('sortOrder');
        const target = document.getElementById('targetFilter');
        const chapter = document.getElementById('chapterFilter');
        if (sort) sort.value = 'review';
        if (target) target.value = 'national9';
        if (chapter) chapter.value = 'all';

        document.querySelectorAll('.filter-btn[data-filter="imp"]').forEach(b => {
            b.classList.toggle('active', b.dataset.value === 'all');
        });

        updateFilteredCounts();
        startStudy();
    }

    function buildCardReviewQueueItems({ target = 'national9', limit = 30 } = {}) {
        const history = loadCardHistory();
        const cards = getScopeTSVCards(target);

        // 우선순위: S/A 위주 → 부족하면 B까지 확장
        const scored = cards
            .map(card => ({ card, score: calcCardReviewPriority(card, history) }))
            .sort((a, b) => b.score - a.score);

        const due = scored.filter(x => x.score >= REVIEW_TRIGGER_SCORE);
        const pickPool = due.length ? due : scored;

        const sa = pickPool.filter(x => x.card.importance === 'S' || x.card.importance === 'A');
        const b = pickPool.filter(x => x.card.importance === 'B');
        const ordered = [...sa, ...b];

        return ordered.slice(0, limit).map(x => toTSVOXItem(x.card));
    }

    function startCardReviewQueue() {
        clearChallengeTicker();
        STATE.challenge.enabled = false;
        STATE.challenge.startedAtTs = 0;
        hidePressureTimer('study');

        // OX 화면으로 이동 후, 카드 전용 큐를 즉시 시작
        switchPage('ox');
        STATE.oxFilters.target = 'national9';
        STATE.oxFilters.source = 'tsv';
        STATE.oxFilters.chapter = 'all';
        STATE.oxFilters.imp = 'all';
        STATE.oxFilters.count = '30';

        const src = document.getElementById('oxSourceFilter');
        const tgt = document.getElementById('oxTargetFilter');
        const ch = document.getElementById('oxChapterFilter');
        const cnt = document.getElementById('oxCount');
        if (src) src.value = 'tsv';
        if (tgt) tgt.value = 'national9';
        if (ch) ch.value = 'all';
        if (cnt) cnt.value = '30';
        document.querySelectorAll('.filter-btn[data-filter="ox-imp"]').forEach(b => {
            b.classList.toggle('active', b.dataset.value === 'all');
        });

        updateFilteredCounts();
        startOXWithItems(buildCardReviewQueueItems({ target: 'national9', limit: 30 }));
    }

    function renderQuestion() {
        if (STATE.challenge.enabled && getChallengeElapsedSec() >= STATE.challenge.limitSec) {
            showStudyResult({ timedOut: true });
            return;
        }

        const q = STATE.studyQuestions[STATE.studyIndex];
        if (!q) return showStudyResult();

        const answered = STATE.studyAnswers[q.id];
        if (answered === undefined) {
            if (STATE.activeStudyQid !== q.id || !STATE.studyStartTs) {
                STATE.activeStudyQid = q.id;
                STATE.studyStartTs = performance.now();
                STATE.studyPressureBudgetSec = getPressureBudgetSec('study', q.importance);
            } else if (!STATE.studyPressureBudgetSec) {
                STATE.studyPressureBudgetSec = getPressureBudgetSec('study', q.importance);
            }
            if (!STATE.pressureTickerId) {
                startPressureTimer('study', STATE.studyPressureBudgetSec);
            }
        }

        let html = `<div class="q-card">
            <div class="q-meta">
                <span class="q-number">${STATE.studyIndex + 1}</span>
                <span class="q-badge year">${q.year} ${escapeHtml(q.exam)}</span>
                <span class="q-badge chapter">${escapeHtml(CHAPTERS[q.chapter] || q.chapter)}</span>
                <span class="q-badge imp-${q.importance}">${q.importance}급</span>
            </div>
            <div class="q-text">${escapeHtml(q.question)}</div>`;

        const choicesVisible = answered !== undefined || !STATE.training.recallFirst || STATE.studyReveal[q.id];
        if (choicesVisible) {
            html += '<div class="choices-list">';
            q.choices.forEach(c => {
                let cls = 'choice-btn';
                if (answered !== undefined) {
                    cls += ' disabled';
                    if (c.num === q.answer) cls += ' correct';
                    else if (c.num === answered) cls += ' incorrect';
                }
                const choiceText = answered !== undefined
                    ? highlightByKeywords(c.text, c.stamp || c.what, c.keywords)
                    : escapeHtml(c.text);
                html += `<div class="${cls}" data-num="${c.num}" onclick="window._selectChoice(${q.id}, ${c.num})">
                    <div class="choice-num">${c.num}</div>
                    <div class="choice-text">${choiceText}</div>
                </div>`;
            });
            html += '</div>';
        } else {
            html += `<div class="recall-prep">
                <div class="recall-title">🧠 인출 선행 5초</div>
                <div class="recall-cue">${escapeHtml(buildRecallCue(q))}</div>
                <button class="review-btn recall-btn" type="button" onclick="window._revealChoices(${q.id})">선지 보기</button>
            </div>`;
        }

        if (answered !== undefined) {
            const isCorrect = answered === q.answer;
            html += renderAnswerPanel(q, isCorrect, STATE.studyResponseSec[q.id] || 0);
        }
        html += '</div>';

        document.getElementById('questionArea').innerHTML = html;
        document.getElementById('qCounter').textContent = `${STATE.studyIndex + 1} / ${STATE.studyQuestions.length}`;
        if (answered !== undefined) {
            lockPressureTimer('study', STATE.studyResponseSec[q.id] || getElapsedSec(STATE.studyStartTs));
        }
        renderChallengeStatus();
    }

    function parseMetaQuestionId(metaKey) {
        const parts = String(metaKey || '').split('_');
        if (parts.length < 2) return null;
        const id = Number(parts[1]);
        return Number.isFinite(id) ? id : null;
    }

    function openMetaModal(mode, questionKey, responseSec, journalEventId) {
        STATE.pendingMeta = {
            key: `${mode}_${questionKey}`,
            mode,
            responseSec,
            date: new Date().toISOString().slice(0, 10),
            journalEventId: journalEventId || null
        };

        const modal = document.getElementById('metaModal');
        if (!modal) return;

        const label = document.getElementById('metaSecondsLabel');
        if (label) {
            const hint = responseSec >= SLOW_THRESHOLD_SEC ? '느림 원인을 태깅하세요.' : '필요 시 이유를 체크하고 기록하세요.';
            label.textContent = `선택까지 걸린 시간: ${responseSec.toFixed(1)}초 (${speedLabel(responseSec)}) · ${hint}`;
        }

        document.querySelectorAll('#metaReasons input').forEach(cb => { cb.checked = false; });
        modal.style.display = 'flex';
    }

    window._revealChoices = function (qid) {
        if (!qid) return;
        STATE.studyReveal[qid] = true;
        renderQuestion();
    };

    window._selectChoice = function (qid, choiceNum) {
        const q = QUESTION_MAP.get(qid);
        if (!q || STATE.studyAnswers[qid] !== undefined) return;

        const elapsed = getElapsedSec(STATE.studyStartTs);
        STATE.studyAnswers[qid] = choiceNum;
        STATE.studyResponseSec[qid] = elapsed;
        lockPressureTimer('study', elapsed);

        const correct = choiceNum === q.answer;
        recordAnswer(String(qid), correct, elapsed);
        const journalEventId = logJournalAttempt({
            subject: 'admin',
            mode: 'study',
            qid: String(qid),
            chapter: q.chapter,
            topic: q.topic,
            importance: q.importance,
            correct,
            sec: elapsed,
            tags: (q.keywords || []).slice(0, 3),
            source: 'admin-study'
        });
        updateStreak();
        renderQuestion();
        if (STATE.training.speedMode) {
            clearAutoNext();
            STATE.autoNextTimerId = setTimeout(() => {
                navStudy(1);
            }, 650);
        } else {
            openMetaModal('study', qid, elapsed, journalEventId);
        }
    };

    function navStudy(dir) {
        clearAutoNext();
        STATE.studyIndex = Math.max(0, Math.min(STATE.studyQuestions.length, STATE.studyIndex + dir));
        renderQuestion();
    }

    function showStudyResult(options = {}) {
        const { timedOut = false } = options;
        const wasChallenge = STATE.challenge.enabled;
        const elapsedChallengeSec = wasChallenge ? getChallengeElapsedSec() : 0;
        const challengeLimitSec = STATE.challenge.limitSec;
        const challengeModeLabel = STATE.challenge.modeLabel || '압축 챌린지';
        clearAutoNext();
        clearChallengeTicker();
        clearPressureTicker();
        hidePressureTimer('study');
        STATE.challenge.enabled = false;
        STATE.challenge.startedAtTs = 0;
        renderChallengeStatus();

        const total = STATE.studyQuestions.length;
        let correct = 0;
        STATE.studyQuestions.forEach(q => {
            if (STATE.studyAnswers[q.id] === q.answer) correct += 1;
        });
        const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
        const secList = Object.values(STATE.studyResponseSec);
        const avgSec = secList.length ? (secList.reduce((a, b) => a + b, 0) / secList.length).toFixed(1) : '0.0';
        const challengePassed = wasChallenge && correct >= CHALLENGE_TARGET_CORRECT && elapsedChallengeSec <= challengeLimitSec && !timedOut;
        const pace = total > 0 ? (elapsedChallengeSec / total).toFixed(1) : '0.0';
        const challengeSummary = wasChallenge
            ? `<div class="result-detail">${challengePassed ? '🏆 90점 챌린지 통과' : '📌 90점 챌린지 재도전 권장'} | ${challengeModeLabel} | ${correct}/20 | ${Math.floor(elapsedChallengeSec / 60)}분 ${Math.floor(elapsedChallengeSec % 60)}초</div>
               <div class="result-detail">문항당 평균 ${pace}초</div>
               <div class="result-detail">${timedOut ? '시간이 종료되었습니다. 복습 큐를 먼저 완료하고 재도전하세요.' : (challengePassed ? '목표 달성. 약점 큐를 유지하며 정확도를 고정하세요.' : `목표까지 ${Math.max(0, CHALLENGE_TARGET_CORRECT - correct)}문항 부족. 오답·지연 문항부터 재학습하세요.`)}</div>`
            : '';

        document.getElementById('questionArea').innerHTML = `<div class="result-panel">
            <div class="result-score">${pct}점</div>
            <div class="result-detail">${total}문항 중 ${correct}문항 정답</div>
            <div class="result-detail">평균 선택시간 ${avgSec}초</div>
            ${challengeSummary}
            <button class="btn-start" style="margin-top:1rem;width:auto;padding:.6rem 2rem;" onclick="location.reload()">🔄 다시 시작</button>
        </div>`;
    }

    function startOXWithItems(items) {
        clearAutoNext();
        clearChallengeTicker();
        clearPressureTicker();
        STATE.challenge.enabled = false;
        STATE.challenge.startedAtTs = 0;
        renderChallengeStatus();
        hidePressureTimer('study');

        STATE.oxItems = Array.isArray(items) ? items : [];
        STATE.oxIndex = 0;
        STATE.oxAnswers = {};
        STATE.oxResponseSec = {};
        STATE.activeOxQid = null;
        STATE.oxStartTs = 0;
        STATE.oxPressureBudgetSec = 0;

        if (!STATE.oxItems.length) return alert('필터 조건에 맞는 문항이 없습니다.');

        document.querySelector('#page-ox .filter-panel').style.display = 'none';
        document.getElementById('oxArea').style.display = 'block';
        renderOX();
    }

    function startOX() {
        startOXWithItems(getFilteredOX());
    }

    function renderOXKeywordChips(item) {
        const stamp = (item.stamp && item.stamp.length ? item.stamp[0] : 'H');
        return uniq(item.keywords || []).slice(0, 12).map(kw => (
            `<span class="what-tag what-tag-${stamp}">${escapeHtml(kw)} · ${item.importance}</span>`
        )).join('');
    }

    function renderOX() {
        const item = STATE.oxItems[STATE.oxIndex];
        if (!item) return showOXResult();

        const answered = STATE.oxAnswers[item.qid];
        if (answered === undefined) {
            if (STATE.activeOxQid !== item.qid || !STATE.oxStartTs) {
                STATE.activeOxQid = item.qid;
                STATE.oxStartTs = performance.now();
                STATE.oxPressureBudgetSec = getPressureBudgetSec('ox', item.importance);
            } else if (!STATE.oxPressureBudgetSec) {
                STATE.oxPressureBudgetSec = getPressureBudgetSec('ox', item.importance);
            }
            if (!STATE.pressureTickerId) {
                startPressureTimer('ox', STATE.oxPressureBudgetSec);
            }
        }

        const statement = answered !== undefined
            ? highlightByKeywords(item.statement, item.stamp || item.what, item.keywords)
            : escapeHtml(item.statement);

        const yearExamLabel = String(item.year || '').trim()
            ? `${escapeHtml(String(item.year))} ${escapeHtml(item.exam)}`
            : escapeHtml(item.exam || '');

        let html = `<div class="ox-card">
            <div class="q-meta" style="justify-content:center;">
                <span class="q-badge year">${yearExamLabel}</span>
                <span class="q-badge chapter">${escapeHtml(CHAPTERS[item.chapter] || item.chapter)}</span>
                <span class="q-badge imp-${item.importance}">${item.importance}급</span>
            </div>
            <div class="ox-statement">${statement}</div>
            <div class="ox-btns">
                <button class="ox-btn ${answered !== undefined ? (answered === true ? (item.answer ? 'selected-correct' : 'selected-incorrect') : '') + ' disabled' : ''} ${answered !== undefined && item.answer === true ? ' correct-answer' : ''}" data-answer="true" onclick="window._selectOX('${item.qid}', true)">⭕</button>
                <button class="ox-btn ${answered !== undefined ? (answered === false ? (!item.answer ? 'selected-correct' : 'selected-incorrect') : '') + ' disabled' : ''} ${answered !== undefined && item.answer === false ? ' correct-answer' : ''}" data-answer="false" onclick="window._selectOX('${item.qid}', false)">❌</button>
            </div>`;

        if (answered !== undefined) {
            const isCorrect = answered === item.answer;
            const keywords = renderOXKeywordChips(item);

            let memoryTip = null;
            let originLine = '';
            let extra = '';

            if (item.bank === 'tsv' && item.card) {
                const tipText = String(item.card.tip || '').trim();
                const conclusionText = String(item.card.conclusion || '').trim();
                const ruleText = String(item.card.rule || '').trim();
                memoryTip = {
                    label: tipText ? '카드 기억팁' : (conclusionText ? '한줄결론' : '판단규칙'),
                    text: tipText || conclusionText || ruleText || '핵심 근거를 한 문장으로 정리하세요.'
                };
                originLine = `📌 ${escapeHtml(item.topic)} | 출처: ${escapeHtml(item.card.source || item.sourceCategory || 'TSV')}`;
                if (item.card.trigger) extra += `<div class="answer-explain">🎯 트리거: ${escapeHtml(item.card.trigger)}</div>`;
                if (item.card.rule) extra += `<div class="answer-explain">🧭 판단규칙: ${escapeHtml(item.card.rule)}</div>`;
                if (item.card.confusion) extra += `<div class="answer-explain">⚠️ 혼동방지: ${escapeHtml(item.card.confusion)}</div>`;
                if (item.card.conclusion) extra += `<div class="answer-explain">✅ 한줄결론: ${escapeHtml(item.card.conclusion)}</div>`;
            } else {
                memoryTip = buildMemoryTip(item.sourceQ, { historyKey: item.qid, responseSec: STATE.oxResponseSec[item.qid] || 0 });
                originLine = `📌 ${escapeHtml(item.topic)} | 원본: Q${item.sourceQ.id}`;
            }

            html += `<div class="answer-panel ${isCorrect ? 'correct' : 'incorrect'}" style="text-align:left;">
                <div class="answer-result">${isCorrect ? '✅ 정답!' : '❌ 오답'}</div>
                <div class="answer-explain">⏱ 선택시간 ${(STATE.oxResponseSec[item.qid] || 0).toFixed(1)}초 (${speedLabel(STATE.oxResponseSec[item.qid] || 0)})</div>
                <div class="answer-explain">${originLine}</div>
                ${extra}
                <div class="memory-tip"><span class="memory-tip-mode">${escapeHtml(memoryTip.label)}</span>${escapeHtml(memoryTip.text)}</div>
                ${keywords ? `<div class="what-tags">${keywords}</div>` : ''}
            </div>`;
        }

        html += `<div class="ox-source">${yearExamLabel} | ${escapeHtml(item.sourceCategory || '국가직 기출/선별')}</div></div>`;

        document.getElementById('oxQuestionArea').innerHTML = html;
        document.getElementById('oxCounter').textContent = `${STATE.oxIndex + 1} / ${STATE.oxItems.length}`;
        if (answered !== undefined) {
            lockPressureTimer('ox', STATE.oxResponseSec[item.qid] || getElapsedSec(STATE.oxStartTs));
        }
    }

    window._selectOX = function (qid, ans) {
        if (!qid || STATE.oxAnswers[qid] !== undefined) return;

        STATE.oxAnswers[qid] = ans;
        const item = STATE.oxItems.find(x => x.qid === qid);
        if (!item) return renderOX();

        const elapsed = getElapsedSec(STATE.oxStartTs);
        STATE.oxResponseSec[qid] = elapsed;
        lockPressureTimer('ox', elapsed);

        const correct = ans === item.answer;
        if (item.bank === 'tsv') {
            recordCardAnswer(String(qid), correct, elapsed);
        } else {
            recordAnswer(String(qid), correct, elapsed);
        }
        const journalEventId = logJournalAttempt({
            subject: 'admin',
            mode: item.bank === 'tsv' ? 'ox-card' : 'ox',
            qid: String(qid),
            chapter: item.chapter,
            topic: item.topic,
            importance: item.importance,
            correct,
            sec: elapsed,
            tags: (item.keywords || []).slice(0, 3),
            source: item.bank === 'tsv' ? 'admin-ox-card' : 'admin-ox'
        });
        updateStreak();
        renderOX();
        if (STATE.training.speedMode) {
            clearAutoNext();
            STATE.autoNextTimerId = setTimeout(() => {
                navOX(1);
            }, 500);
        } else {
            openMetaModal('ox', qid, elapsed, journalEventId);
        }
    };

    function navOX(dir) {
        clearAutoNext();
        STATE.oxIndex = Math.max(0, Math.min(STATE.oxItems.length, STATE.oxIndex + dir));
        renderOX();
    }

    function showOXResult() {
        clearAutoNext();
        clearPressureTicker();
        hidePressureTimer('ox');
        const total = STATE.oxItems.length;
        let correct = 0;
        STATE.oxItems.forEach(item => {
            if (STATE.oxAnswers[item.qid] === item.answer) correct += 1;
        });
        const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
        const secList = Object.values(STATE.oxResponseSec);
        const avgSec = secList.length ? (secList.reduce((a, b) => a + b, 0) / secList.length).toFixed(1) : '0.0';

        document.getElementById('oxQuestionArea').innerHTML = `<div class="result-panel">
            <div class="result-score">${pct}점</div>
            <div class="result-detail">${total}문항 중 ${correct}문항 정답</div>
            <div class="result-detail">평균 선택시간 ${avgSec}초</div>
            <button class="btn-start" style="margin-top:1rem;width:auto;padding:.6rem 2rem;" onclick="location.reload()">🔄 다시 시작</button>
        </div>`;
    }

    function renderWHAT() {
        const grid = document.getElementById('whatGrid');
        const colors = { W: '#6c5ce7', H: '#00cec9', A: '#e17055', T: '#fdcb6e' };
        grid.innerHTML = WHAT_CARDS.map(c => `<div class="what-card" data-type="${c.type}">
            <div class="what-card-type" style="color:${colors[c.type]}">${c.type}</div>
            <div class="what-card-title">${escapeHtml(c.title)}</div>
            <div class="what-card-rule">${escapeHtml(c.rule)}</div>
            <div class="what-card-tip">${escapeHtml(c.tip)}</div>
        </div>`).join('');

        const list = document.getElementById('trapList');
        list.innerHTML = TRAP_PATTERNS.map(t => `<div class="trap-item">
            <span class="trap-freq ${t.freq}">${t.freq}</span>
            <div>
                <div class="trap-name">${escapeHtml(t.name)}</div>
                <div class="trap-desc">${escapeHtml(t.desc)}</div>
            </div>
        </div>`).join('');
    }

    function getFilteredTwinCards() {
        const scope = STATE.twinFilters.scope === 'all' ? 'all' : 'core';
        const imp = STATE.twinFilters.imp || 'all';
        return getScopeTwinCards(scope).filter(card => {
            if (imp !== 'all' && card.importance !== imp) return false;
            return true;
        });
    }

    function startTwinTrainer() {
        const area = document.getElementById('twinArea');
        if (!area) return;
        const list = shuffle(getFilteredTwinCards());
        STATE.twinItems = list;
        STATE.twinIndex = 0;
        STATE.twinRevealed = false;
        area.style.display = 'block';
        renderTwinTrainer();
    }

    function navTwin(delta) {
        if (!STATE.twinItems.length) return;
        const next = (STATE.twinIndex + delta + STATE.twinItems.length) % STATE.twinItems.length;
        STATE.twinIndex = next;
        STATE.twinRevealed = false;
        renderTwinTrainer();
    }

    function toggleTwinReveal() {
        if (!STATE.twinItems.length) return;
        STATE.twinRevealed = !STATE.twinRevealed;
        renderTwinTrainer();
    }

    function renderTwinTrainer() {
        const counter = document.getElementById('twinCounter');
        const cardArea = document.getElementById('twinCardArea');
        if (!counter || !cardArea) return;

        const total = STATE.twinItems.length;
        if (!total) {
            counter.textContent = '0 / 0';
            cardArea.innerHTML = `<div class="twin-card">필터 조건에 맞는 쌍둥이 프레임이 없습니다.</div>`;
            return;
        }

        const card = STATE.twinItems[STATE.twinIndex];
        const yearExamLabel = String(card.year || '').trim()
            ? `${escapeHtml(String(card.year))} ${escapeHtml(card.exam)}`
            : escapeHtml(card.exam || '');

        counter.textContent = `${STATE.twinIndex + 1} / ${total}`;

        const axes = (card.axes || []).filter(Boolean);
        const axesHtml = axes.map(ax => `
            <div class="twin-axis ${STATE.twinRevealed ? '' : 'hidden'}">${escapeHtml(ax)}</div>
        `).join('');

        window._toggleTwinReveal = () => toggleTwinReveal();

        cardArea.innerHTML = `
            <div class="twin-card">
                <div class="twin-meta">
                    <span class="q-badge year">${yearExamLabel}</span>
                    <span class="q-badge chapter">${escapeHtml(CHAPTERS[card.chapter] || card.chapter)}</span>
                    <span class="q-badge imp-${card.importance}">${card.importance}급</span>
                </div>

                <div class="twin-concepts">
                    <span class="twin-pill">${escapeHtml(card.conceptA)}</span>
                    <span class="twin-vs">vs</span>
                    <span class="twin-pill">${escapeHtml(card.conceptB)}</span>
                </div>

                <button class="review-btn twin-reveal" onclick="window._toggleTwinReveal()">
                    ${STATE.twinRevealed ? '🙈 다시 가리기' : '👀 비교축 보기'}
                </button>

                <div class="twin-axes">${axesHtml}</div>
                ${card.tip ? `<div class="twin-tip">💡 ${escapeHtml(card.tip)}</div>` : ''}
                <div class="twin-source">${escapeHtml(card.source || '')}</div>
            </div>
        `;
    }

    function renderMetaInsights() {
        const el = document.getElementById('metaInsight');
        if (!el) return;

        const meta = loadMeta();
        const reasonCounts = {};
        const slowChapterCounts = {};
        let tagged = 0;

        Object.entries(meta).forEach(([key, rows]) => {
            const qid = parseMetaQuestionId(key);
            const q = qid ? QUESTION_MAP.get(qid) : null;
            (rows || []).forEach(row => {
                tagged += 1;
                (row.reasons || []).forEach(r => { reasonCounts[r] = (reasonCounts[r] || 0) + 1; });
                if (q && row.responseSec >= SLOW_THRESHOLD_SEC) {
                    slowChapterCounts[q.chapter] = (slowChapterCounts[q.chapter] || 0) + 1;
                }
            });
        });

        const topReasons = Object.entries(reasonCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([k, c]) => `<span class="insight-chip">${escapeHtml(META_REASON_LABELS[k] || k)} ${c}회</span>`)
            .join('');

        const topChapters = Object.entries(slowChapterCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([ch, c]) => `<span class="insight-chip">${escapeHtml(CHAPTERS[ch] || ch)} ${c}회</span>`)
            .join('');

        el.innerHTML = `
            <div class="insight-title">메타인지 태깅 누적 ${tagged}건</div>
            <div class="insight-chips">${topReasons || '<span class="insight-chip">아직 태깅 데이터가 없습니다</span>'}</div>
            <div class="insight-title" style="margin-top:.65rem;">느린 응답이 많은 단원</div>
            <div class="insight-chips">${topChapters || '<span class="insight-chip">데이터 부족</span>'}</div>
        `;
    }

    function renderWeakAnalysis() {
        const h = loadHistory();
        const el = document.getElementById('weakAnalysis');
        const items = [];

        QUESTIONS.forEach(q => {
            const row = h[q.id];
            if (!row || !row.attempts) return;
            const rate = Math.round((row.correct / row.attempts) * 100);
            items.push({ q, rate, attempts: row.attempts, avgSec: row.avgResponseSec || 0 });
        });

        items.sort((a, b) => (a.rate - b.rate) || (b.avgSec - a.avgSec));

        if (!items.length) {
            el.innerHTML = '<p style="color:var(--text-dim);">아직 풀이 기록이 없습니다. 학습을 시작하세요!</p>';
            return;
        }

        el.innerHTML = items.slice(0, 25).map(item => {
            const cls = item.rate < 50 ? 'bad' : item.rate < 80 ? 'mid' : 'good';
            return `<div class="weak-item">
                <div class="weak-info">
                    <div class="weak-topic">${escapeHtml(item.q.topic)}</div>
                    <div class="weak-detail">${escapeHtml(CHAPTERS[item.q.chapter] || item.q.chapter)} | ${item.q.importance}급 | ${item.attempts}회 | 평균 ${item.avgSec.toFixed(1)}초</div>
                </div>
                <div class="weak-rate ${cls}">${item.rate}%</div>
            </div>`;
        }).join('');
    }

    function renderGuide() {
        const el = document.getElementById('guideContent');
        if (!el) return;

        const core = getScopeQuestions('national9');
        const coreCount = core.length;
        const rawNationalCount = QUESTIONS.filter(q => String(q.exam || '').includes('국가직')).length;
        const oxCount = core.reduce((s, q) => s + (q.choices?.length || 0), 0);
        const cardCore = getScopeTSVCards('national9');
        const cardCount = cardCore.length;
        const twinCount = getScopeTwinCards('core').length;
        const saCount = core.filter(q => q.importance === 'S' || q.importance === 'A').length;
        const saPct = coreCount ? Math.round((saCount / coreCount) * 100) : 0;
        const cardSaCount = cardCore.filter(c => c.importance === 'S' || c.importance === 'A').length;
        const cardSaPct = cardCount ? Math.round((cardSaCount / cardCount) * 100) : 0;
        const days = Math.max(1, calcDday());
        const cycleGoal = days >= 35 ? 3 : (days >= 18 ? 2 : 1.5);
        const dailyStem = Math.max(20, Math.ceil((coreCount * cycleGoal) / days));
        const dailyOxChoice = Math.max(40, Math.ceil((oxCount * Math.min(cycleGoal, 1.4)) / days));
        const dailyOxCard = Math.max(25, Math.ceil((cardCount * Math.min(cycleGoal, 1.4)) / days));
        const dailyTwin = Math.max(5, Math.ceil((twinCount * Math.min(cycleGoal, 1.2)) / days));
        const dailyOx = dailyOxChoice + dailyOxCard;
        const coverageGrade = coreCount >= 100 ? '충분(상)'
            : coreCount >= 75 ? '충분(중)'
                : coreCount >= 55 ? '준수(보강권장)'
                    : '보강 필요';

        const h = loadHistory();
        const ch = loadCardHistory();
        let red = 0;
        let amber = 0;
        let yellow = 0;
        core.forEach(q => {
            const row = h[String(q.id)];
            if (!row || !row.attempts) return;
            const wrong = Math.max(0, row.attempts - row.correct);
            const acc = row.correct / row.attempts;
            const avgSec = row.avgResponseSec || 0;
            if (wrong >= 2 || acc < 0.6) red += 1;
            else if (avgSec >= SLOW_THRESHOLD_SEC) amber += 1;
            else if (wrong === 1) yellow += 1;
        });
        let redC = 0;
        let amberC = 0;
        let yellowC = 0;
        cardCore.forEach(c => {
            const row = ch[String(c.id)];
            if (!row || !row.attempts) return;
            const wrong = Math.max(0, row.attempts - row.correct);
            const acc = row.correct / row.attempts;
            const avgSec = row.avgResponseSec || 0;
            if (wrong >= 2 || acc < 0.6) redC += 1;
            else if (avgSec >= SLOW_THRESHOLD_SEC) amberC += 1;
            else if (wrong === 1) yellowC += 1;
        });
        const dueReview = core.filter(q => calcReviewPriority(q, h) >= REVIEW_TRIGGER_SCORE).length;
        const dueReviewC = cardCore.filter(c => calcCardReviewPriority(c, ch) >= REVIEW_TRIGGER_SCORE).length;
        const dueReviewAll = dueReview + dueReviewC;

        el.innerHTML = `
            <div class="guide-grid">
                <div class="guide-card">
                    <div class="guide-title">문제은행 충분성</div>
                    <div class="guide-value">${coverageGrade}</div>
                    <div class="guide-desc">객관식 핵심 ${coreCount}문항 · 선지 OX ${oxCount}문항 · S/A ${saPct}%</div>
                    <div class="guide-desc">반응카드 OX ${cardCount}문장 · 카드 S/A ${cardSaPct}% · 쌍둥이 ${twinCount}세트</div>
                    <div class="guide-desc">원자료 기준: 국가직 계열 직기출 ${rawNationalCount}문항</div>
                    <div class="guide-desc">국가직 9급 실전 20문 기준 반복 인출용 데이터는 현재 ${coverageGrade} 수준입니다.</div>
                </div>
                <div class="guide-card">
                    <div class="guide-title">시간 부족 대응(자동 산출)</div>
                    <div class="guide-value">D-${days}</div>
                    <div class="guide-desc">하루 목표: 통합 ${dailyStem}문 + OX ${dailyOx}문 + 쌍둥이 ${dailyTwin}세트</div>
                    <div class="guide-desc">OX 구성: 선지 ${dailyOxChoice} + 카드 ${dailyOxCard}</div>
                    <div class="guide-desc">권장 회전수: 핵심범위 ${cycleGoal.toFixed(1)}회독</div>
                </div>
                <div class="guide-card">
                    <div class="guide-title">불완전 반응 문항 처리</div>
                    <div class="guide-desc">객관식: 🔴 ${red} · 🟠 ${amber} · 🟡 ${yellow}</div>
                    <div class="guide-desc">카드: 🔴 ${redC} · 🟠 ${amberC} · 🟡 ${yellowC}</div>
                    <div class="guide-desc">즉시 복습 큐: 총 ${dueReviewAll}문항 (객관식 ${dueReview} + 카드 ${dueReviewC})</div>
                    <div class="review-actions" style="margin-top:.6rem;">
                        <button class="review-btn" data-action="start-review-queue">객관식 큐</button>
                        <button class="review-btn" data-action="start-card-review-queue">카드 큐</button>
                    </div>
                </div>
            </div>
            <div class="guide-card" style="margin-top:.8rem;">
                <div class="guide-title">완벽하지 않은 문항 처리 규칙</div>
                <div class="guide-list">
                    <div>1. <strong>반복오답(🔴)</strong> : 오늘 2회 + 내일 1회 + 3일 뒤 1회, 정답근거 1문장 인출 완료까지 반복</div>
                    <div>2. <strong>지연문항(🟠)</strong> : 인출선행 ON 상태에서 5초 답변 연습 3회 후 재채점</div>
                    <div>3. <strong>단발오답(🟡)</strong> : 당일 마감 전 1회 재풀이로 즉시 교정</div>
                    <div>4. <strong>기억팁 자동모드</strong> : 기본 이미지형, 느리거나 반복오답이면 암송형, 스피드모드면 초압축형</div>
                </div>
            </div>
            <div class="guide-card" style="margin-top:.8rem;">
                <div class="guide-title">90점 압축 루틴</div>
                <div class="guide-list">
                    <div>1. 오전: 통합 20문(정확도 우선, 인출선행 ON)</div>
                    <div>2. 오후: 복습 큐 30문(객관식 15 + 카드 15, 오답·지연만)</div>
                    <div>3. 밤: OX ${Math.max(40, dailyOx)}문(속도 우선, 혼합 추천)</div>
                    <div>4. 종료 전: 쌍둥이 ${dailyTwin}세트(비교축 인출 → 공개)</div>
                    <div>5. 마무리: 오늘 틀린 문항 정답근거 1줄 암송 5분</div>
                </div>
            </div>
        `;
    }

    function setupMetaModal() {
        const submit = document.getElementById('metaSubmit');
        const skip = document.getElementById('metaSkip');
        const modal = document.getElementById('metaModal');
        if (!submit || !modal) return;

        function closeModal() {
            document.querySelectorAll('#metaReasons input').forEach(cb => { cb.checked = false; });
            modal.style.display = 'none';
            STATE.pendingMeta = null;
        }

        submit.addEventListener('click', () => {
            if (!STATE.pendingMeta) return closeModal();

            const reasons = [];
            document.querySelectorAll('#metaReasons input:checked').forEach(cb => reasons.push(cb.value));

            const meta = loadMeta();
            if (!meta[STATE.pendingMeta.key]) meta[STATE.pendingMeta.key] = [];
            meta[STATE.pendingMeta.key].push({
                mode: STATE.pendingMeta.mode,
                responseSec: Number(STATE.pendingMeta.responseSec.toFixed(1)),
                reasons,
                date: STATE.pendingMeta.date
            });
            saveMeta(meta);
            appendJournalMeta(
                STATE.pendingMeta.journalEventId,
                reasons,
                STATE.pendingMeta.responseSec >= SLOW_THRESHOLD_SEC ? '느린 원인 태깅' : ''
            );
            closeModal();
        });

        if (skip) {
            skip.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });
    }

    function init() {
        const dday = calcDday();
        const ddayEl = document.getElementById('ddayBadge');
        if (ddayEl) ddayEl.textContent = `D-${dday}`;

        STATE.training = { ...STATE.training, ...loadTraining() };

        syncJournalLink();
        setupSubjectSwitch();
        setupNav();
        setupFilters();
        setupKeyboardShortcuts();
        setupMetaModal();
        syncTrainingOptionsUI();
        syncChallengeButtonLabel();
        populateChapterSelects();
        updateFilteredCounts();
        renderDashboard();
        applyAutoActionFromQuery();
    }

    function applyAutoActionFromQuery() {
        const params = new URLSearchParams(window.location.search);
        const auto = params.get('auto');
        if (auto !== 'review') return;
        startReviewQueue();
        params.delete('auto');
        const next = params.toString();
        const path = window.location.pathname;
        window.history.replaceState({}, '', next ? `${path}?${next}` : path);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
