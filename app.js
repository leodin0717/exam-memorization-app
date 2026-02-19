// 행정법 STAMP 암기전략 웹앱 - 메인 앱 로직
(function () {
    'use strict';

    // ===== STATE =====
    const STORAGE = {
        history: 'stamp_history',
        streak: 'stamp_streak',
        training: 'stamp_training_v1'
    };
    const SLOW_THRESHOLD_SEC = 8;

    // 초현실 호러 시나리오 스타일 기억 규칙
    const MEMORY_TIP_RULES = [
        { re: /사정판결|취소판결/, scene: '💀 법정 한가운데서 판사 망치가 네 머리 위로 내려치려는 순간—"잠깐!" 공익이라는 거대한 방패가 쾅 튀어나와 망치를 막음. 망치 대신 "위법확인"이라 적힌 피 묻은 도장이 이마에 철컥 찍힘. "취소는 못 해, 확인만 해."', slogan: '"망치 멈추고(사정판결), 도장 철컥(위법확인)!"' },
        { re: /하자의 승계|선결문제/, scene: '🔗 네 팔에 감긴 녹슨 쇠사슬이 앞의 처분 관에서 뒤의 처분 관까지 이어져 있어. 앞 관이 폭발하자 불꽃이 사슬을 타고 흘러와 뒤 관도 같이 "꽈앙!" 터져버림. 쇠사슬 타는 냄새, 살 타는 고통이 그대로 전달됨.', slogan: '"앞관 폭발(위법), 사슬 타고(승계), 뒤관 꽈앙!"' },
        { re: /신뢰보호|실권의 법리/, scene: '🛡️ 국가가 "이리 와!" 손짓하며 달콤한 약속을 해서 네가 뛰어갔는데, 갑자기 바닥이 함정처럼 열림. 추락하려는 순간 "신뢰보호"라 새겨진 황금 방패가 빛을 내며 널 붙잡아줌. 방패 잡은 손에서 따뜻한 열기가 쫙.', slogan: '"달려갔다 함정(배신), 황금방패 번쩍(신뢰보호)!"' },
        { re: /무효|취소|철회/, scene: '💥 세 개의 문이 있어. 첫째 문—열면 안에 아무것도 없는 텅 빈 어둠(무효, 처음부터 없음). 둘째 문—들어가면 뒤에서 누가 너를 확 잡아끌어 다시 밖으로 던짐(취소, 나중에 걷어냄). 셋째 문—들어간 뒤 문이 천천히 녹아 사라짐(철회, 앞으로 없앰).', slogan: '"텅 빈 문(무효), 끌어내기(취소), 녹아 사라짐(철회)!"' },
        { re: /재량권|일탈|남용/, scene: '🎯 거대한 과녁판 앞에 활을 쏘는데, 과녁 안에 꽂히면 OK(재량). 과녁 밖으로 빗나가면 화살이 되돌아와 네 무릎을 꿰뚫음(일탈). 과녁에 맞긴 했는데 독이 묻어 있으면 남용—과녁이 시커멓게 썩어감.', slogan: '"과녁 안(재량), 밖 화살 귀환(일탈), 독화살(남용)!"' },
        { re: /행정입법|법규명령|행정규칙/, scene: '📚 두 권의 책이 있어. 빨간 책(법규명령)은 밖에 있는 모든 사람을 쇠사슬로 묶는 힘이 있고, 파란 책(행정규칙)은 건물 안 사람만 조용히 명령함. 빨간 책을 열면 바깥에서 비명이, 파란 책은 안에서만 속삭임.', slogan: '"빨간 책 밖 비명(법규명령), 파란 책 안 속삭임(행정규칙)!"' },
        { re: /행정계획|계획재량/, scene: '🗺️ 거대한 미로 위에서 지도를 펼치고 있어. 수백 개의 이익이 형광빛 선으로 겹쳐지고, 네 손가락이 최종 경로를 찍으면 그 길만 빛나고 나머지는 시커멓게 꺼짐. 경로를 정하는 순간의 전율—그게 계획재량.', slogan: '"미로 위 형광선(이익형량), 손가락 찍(계획재량)!"' },
        { re: /집행정지|가처분/, scene: '⏸️ 거대한 불도저가 네 집을 향해 돌진하고 있어. 바로 그때 "집행정지!"라 외치면 공중에서 거대한 빨간 손이 나타나 불도저 앞을 쾅 막음. 불도저 엔진이 부르르 떨지만 한 발짝도 못 나감. 본안 판결 전까지!', slogan: '"불도저 돌진, 빨간 손 쾅(집행정지), 멈춤!"' },
        { re: /손실보상|손해배상/, scene: '🏗️ 두 개의 지갑이 있어. 금색 지갑(보상)—정부가 합법적으로 네 땅을 가져가며 돈을 넣어줌. 검은색 지갑(배상)—공무원이 위법하게 네 팔을 부러뜨려서 피 값을 지불함. 금색은 고마운 돈, 검은색은 피 묻은 돈.', slogan: '"금 지갑 적법(보상), 검은 지갑 위법(배상)!"' },
        { re: /당사자소송|항고소송/, scene: '🧭 갈림길에 서 있어. 오른쪽 화살표(항고소송)는 거대한 공권력 성을 향하고, 왼쪽 화살표(당사자소송)는 두 사람이 마주 앉은 탁자를 향해. 공권력에 맞서려면 오른쪽! 관계만 확인하면 왼쪽! 잘못 가면 벼랑.', slogan: '"성 향해(항고), 탁자 향해(당사자), 잘못 가면 벼랑!"' },
        { re: /제소기간|고시/, scene: '⚡ 광화문 네거리에 서 있는데 하늘에서 거대한 관보가 벼락처럼 떨어져 발등을 쾅 찍어버림. 뼈 으스러지는 고통과 동시에 발등에서 빨간 초시계가 튀어나와 째깍째깍 소름 끼치게 돌아감. 고시 순간이 기산점!', slogan: '"발등 찧자마자(고시효력), 초시계 째깍(기산)!"' },
        { re: /행정대집행|대집행|토지인도/, scene: '🏚️ 새벽에 눈 뜨면 불도저가 네 집 앞에 벌써 와 있어. "계고→통지→대집행" 스티커가 차례로 벽에 철컥 붙더니, 마지막 스티커 붙자마자 벽이 와르르 무너짐. 먼지, 파편, 비명—이게 대집행이다.', slogan: '"스티커 세 장(계고통지대집행), 벽 와르르!"' },
        { re: /처분성|처분[이가]/, scene: '🚪 거대한 문 앞에 서 있는데, 문 위에 "처분"이라 적혀 있어. 이 문을 통과해야만 법원이라는 전쟁터에 입장 가능. 처분성 없으면? 문이 네 얼굴 앞에서 "퍽!" 닫혀버리고 코뼈가 으드득.', slogan: '"처분 문 통과해야 전쟁터(소송), 아니면 퍽!"' },
        { re: /부관|조건|기한|부담/, scene: '🎁 선물 상자(허가)를 받았는데, 뚜껑 열자마자 안에서 뱀(부관)이 튀어나옴! 조건 뱀은 "이거 안 하면 선물 회수", 기한 뱀은 "시간 안에 안 열면 선물 녹음", 부담 뱀은 "대가를 내놔" 이를 드러냄.', slogan: '"선물 열면 뱀(부관), 조건·기한·부담 이빨!"' }
    ];

    const STATE = {
        currentPage: 'dashboard',
        candidateQuestions: [],
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
        activeOxKey: null,
        oxStartTs: 0,
        filters: { imp: 'all', year: 'all', chapter: 'all', sort: 'random', target: 'national9' },
        oxFilters: { imp: 'all', chapter: 'all', count: 20, target: 'national9' },
        analytics: null,
        autoNextTimerId: null,
        pressureTickerId: null,
        studyPressureBudgetSec: 0,
        oxPressureBudgetSec: 0,
        training: {
            speedMode: false,
            recallFirst: true
        }
    };

    const STAMP_ORDER = ['S', 'T', 'A', 'M', 'P'];
    const STAMP_NAMES = {
        S: '주체(Subject)',
        T: '시점(Time)',
        A: '행위(Action)',
        M: '수식어(Modifier)',
        P: '결론(Predicate)'
    };

    // 국가직 9급 학습자 기준 출처 가중치
    const EXAM_WEIGHTS = {
        '국가직': 1.0,
        '지방직': 0.86,
        '국가직7급': 0.72,
        '국회직8급': 0.68,
        '소방총론': 0.35,
        '소방승진': 0.33,
        '소방간부': 0.33,
        '해양경찰': 0.33,
        '경찰승진': 0.33
    };

    // 최신 9급 국가직 빈도 기반 단원 가중치
    const CHAPTER_WEIGHTS = {
        CH01: 0.88, CH02: 0.82, CH03: 0.95, CH04: 0.93, CH05: 0.90, CH06: 0.90,
        CH07: 0.86, CH08: 0.86, CH09: 0.89, CH10: 0.94, CH11: 0.96, CH12: 0.82,
        CH13: 0.74, CH14: 0.85, CH15: 0.83, CH16: 0.68, CH17: 0.66, CH18: 0.68,
        CH19: 0.84, CH20: 0.80, CH21: 0.73, CH22: 0.58, CH23: 0.77, CH24: 0.48
    };

    const STAMP_PATTERNS = {
        S: [
            /행정청[이가은는]?/g, /법원[이가은는]?/g, /대법원[이가은는]?/g, /헌법재판소/g,
            /처분청[이가은는]?/g, /재결청/g, /행정관청/g, /행정심판위원회/g,
            /대통령[이가은는]?/g, /국회[가는]?/g, /지방의회/g, /위원회/g,
            /공무원[이가의]?/g, /공공기관[이가은는]?/g, /사업시행자/g,
            /원고[가는]?/g, /피고[가는]?/g, /피청구인/g, /청구인/g,
            /양도인/g, /양수인/g, /의무자/g, /상대방/g,
            /토지소유자/g, /토지수용위원회/g, /중앙토지수용위원회/g,
            /공정거래위원회/g, /근로복지공단/g, /한국자산관리공사/g, /교도소장/g, /조합[이가]?/g
        ],
        T: [
            /처분\s?시/g, /판결\s?시/g, /재결\s?시/g, /변론종결\s?시/g, /의결일/g,
            /처분 당시/g, /처분 후/g, /처분 전/g,
            /\d+일\s?(이내|전|후|이상)/g, /\d+년\s?(이내|전|이상)/g,
            /\d+월/g, /기간[이가을의]?/g, /기한/g,
            /소급/g, /장래에/g, /소멸시효/g, /제척기간/g, /재결기간/g,
            /납부기한/g, /제소기간/g, /불변기간/g,
            /처분[이가] 있음을 안 날/g, /처분이 있은 날/g,
            /성립 이전/g, /성립 이후/g, /확정[된되]/g,
            /종결\s?시/g, /사실상태를 기준/g,
            /효력 발생/g, /효력을 상실/g, /효력이 소멸/g
        ],
        A: [
            /할 수 있다/g, /하여야 한다/g, /할 수 없다/g,
            /해서는 안 된다/g, /아니할 수 있다/g,
            /가능하다/g, /불가하다/g, /불가능하다/g,
            /취소할 수/g, /철회할 수/g, /변경할 수/g,
            /부과할 수/g, /징수할 수/g, /징수해서는/g,
            /제기할 수/g, /청구할 수/g, /구할 수/g,
            /허용된다/g, /허용되지/g, /금지/g,
            /수리하여야/g, /수리[를을]/g,
            /기속행위/g, /재량행위/g, /재량[에의]/g,
            /필요적으로/g, /임의적으로/g,
            /보상하여야/g, /보상하지/g, /보상[할을]/g
        ],
        M: [
            /반드시/g, /항상/g, /모든/g, /절대/g, /일체/g, /어떠한/g,
            /어떤 경우에도/g, /원칙적으로/g, /현저히/g, /명백히/g,
            /직접적[으인]/g, /간접적/g, /전부/g,
            /특별한 사정이 없는 한/g, /특별한 사정/g,
            /중대하고 명백/g, /중대한/g, /경미한/g,
            /불확정개념/g, /구체적[으인]/g,
            /당연히/g, /곧바로/g, /즉시/g, /바로/g,
            /완전무결/g, /최소한/g, /충분[한히]/g,
            /뿐만 아니라/g, /에 한정/g, /에 불과/g,
            /동일성/g, /기본적 사실관계/g
        ],
        P: [
            /인정된다/g, /인정되지 않는다/g, /인정되지 아니한다/g, /인정될 수 없다/g,
            /해당한다/g, /해당하지 않는다/g, /해당하지 아니한다/g,
            /위법하다/g, /적법하다/g, /위법하게 된다/g, /위법[한이]/g,
            /무효[이가로]?/g, /유효[한이]?/g, /당연무효/g, /당연히 무효/g,
            /처분[에이]?성[이가]?/g, /처분에 해당/g,
            /위반[된되하]/g, /위배[된되하]/g,
            /배제된다/g, /배제되지/g,
            /성립[될되한하]/g, /성립될 수 없다/g,
            /발생[하한]/g, /소멸[된되한하]/g,
            /부적법/g, /적법[한하]/g,
            /정당화/g, /정당[한하]/g,
            /상실[한하된]/g, /아니다/g, /아닌/g,
            /보아야 한다/g, /볼 수 있다/g, /볼 수 없다/g,
            /구할 .{0,6}이익이 있다/g, /구할 .{0,6}이익이 없다/g,
            /인용할 수 없다/g, /인용할 수 있다/g,
            /치유[되된]/g, /실효[되된]/g
        ]
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
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
    function normalizeKeyword(kw) {
        return String(kw || '').replace(/\s+/g, '').trim();
    }
    function gradeByScore(score) {
        if (score >= 0.86) return 'S';
        if (score >= 0.72) return 'A';
        return 'B';
    }
    function inferSubtopic(q) {
        if (q.topic && q.topic.includes('·')) return q.topic.split('·')[1].trim();
        if (q.topic && q.topic.includes('/')) return q.topic.split('/')[1].trim();
        return q.topic || '핵심판례';
    }
    function inferCoreMaterial(q) {
        if (!q.keywords || q.keywords.length === 0) return q.topic || '핵심논점';
        return q.keywords.slice(0, 2).join(' · ');
    }
    function guessStampFromTerm(term) {
        const value = String(term || '');
        const hint = {
            S: /행정청|법원|원고|피고|처분청|재결청|위원회|상대방|양도인|양수인|사업시행자|소유자|공무원|청장/,
            T: /시점|기간|기한|제소|소멸|제척|처분시|판결시|재결시|불변기간|변론종결|효력/,
            A: /취소|철회|부과|징수|신고|수리|허가|청구|제기|보상|기속|재량|집행/,
            M: /원칙|예외|명백|중대|특별|항상|반드시|직접|간접|한정/,
            P: /적법|위법|무효|유효|해당|인정|부정|처분성|소의이익|치유|실효/
        };
        for (const s of STAMP_ORDER) {
            if (hint[s].test(value)) return s;
        }
        return 'P';
    }
    function getImportanceWeight(imp) {
        if (imp === 'S') return 1.0;
        if (imp === 'A') return 0.82;
        return 0.64;
    }
    function getExamWeight(exam) {
        return EXAM_WEIGHTS[exam] ?? 0.4;
    }
    function getChapterWeight(chapter) {
        if (STATE.analytics?.chapterWeights?.[chapter]) return STATE.analytics.chapterWeights[chapter];
        return CHAPTER_WEIGHTS[chapter] ?? 0.65;
    }
    function calcTargetMetrics(q, chapterWeightMap = null) {
        const examW = getExamWeight(q.exam);
        const chapterW = chapterWeightMap?.[q.chapter] ?? getChapterWeight(q.chapter);
        const impW = getImportanceWeight(q.importance);
        const raw = Number((examW + chapterW + impW).toFixed(3));
        const normalized = Number((raw / 3).toFixed(3));
        return {
            sourceWeight: Number(examW.toFixed(3)),
            chapterFrequencyWeight: Number(chapterW.toFixed(3)),
            importanceWeight: Number(impW.toFixed(3)),
            raw,
            normalized,
            grade: gradeByScore(normalized)
        };
    }
    function ensureQuestionDefaults(q) {
        q.importance = ['S', 'A', 'B'].includes(q.importance) ? q.importance : 'B';
        q.keywords = Array.isArray(q.keywords) ? q.keywords.filter(Boolean) : [];
        q.choices = Array.isArray(q.choices) ? q.choices.map((c, idx) => ({
            num: Number(c.num) || (idx + 1),
            text: c.text || '',
            ...(typeof c.ox === 'boolean' ? { ox: c.ox } : {}),
            stamp: Array.isArray(c.stamp) ? c.stamp : []
        })) : [];
    }
    function isPlayableQuestion(q) {
        return Number.isInteger(q.answer)
            && Array.isArray(q.choices)
            && q.choices.length >= 4
            && q.choices.every(c => typeof c.ox === 'boolean');
    }
    function getPlayableQuestions() {
        return QUESTIONS.filter(isPlayableQuestion);
    }
    function applySupplementData() {
        QUESTIONS.forEach(ensureQuestionDefaults);
        const supplement = Array.isArray(window.LAW_SUPPLEMENT_QUESTIONS) ? window.LAW_SUPPLEMENT_QUESTIONS : [];
        const candidates = Array.isArray(window.LAW_CANDIDATE_QUESTIONS) ? window.LAW_CANDIDATE_QUESTIONS : [];
        const ids = new Set(QUESTIONS.map(q => String(q.id)));

        supplement.forEach(raw => {
            const q = { ...raw };
            if (ids.has(String(q.id))) return;
            ensureQuestionDefaults(q);
            QUESTIONS.push(q);
            ids.add(String(q.id));
        });

        STATE.candidateQuestions = candidates.map(raw => {
            const q = { ...raw };
            ensureQuestionDefaults(q);
            return q;
        });
    }
    function buildChapterFrequencyWeights(pool) {
        const bucket = {};
        pool.forEach(q => {
            if (!q.chapter) return;
            const score = getExamWeight(q.exam) * getImportanceWeight(q.importance) * (q.verified === false ? 0.9 : 1.0);
            bucket[q.chapter] = (bucket[q.chapter] || 0) + score;
        });
        const values = Object.values(bucket);
        if (!values.length) return { ...CHAPTER_WEIGHTS };
        const min = Math.min(...values);
        const max = Math.max(...values);
        const normalized = {};
        Object.entries(bucket).forEach(([chapter, value]) => {
            if (max === min) {
                normalized[chapter] = 0.75;
            } else {
                normalized[chapter] = Number((0.48 + ((value - min) / (max - min)) * 0.52).toFixed(3));
            }
        });
        return { ...CHAPTER_WEIGHTS, ...normalized };
    }
    function getFocusQuestions(mode) {
        const pool = getPlayableQuestions();
        if (mode === 'all') return pool;
        if (mode === 'expanded') return pool.filter(q => q.isNationalExtended);
        return pool.filter(q => q.isNationalCore);
    }
    function getTermGrade(term) {
        const key = normalizeKeyword(term);
        if (STATE.analytics && STATE.analytics.keywordGrades[key]) {
            return STATE.analytics.keywordGrades[key].grade;
        }
        return 'B';
    }
    function collectStampKeywordMap(texts, priorityStamps, keywords) {
        const perStamp = { S: new Map(), T: new Map(), A: new Map(), M: new Map(), P: new Map() };
        texts.forEach(text => {
            STAMP_ORDER.forEach(s => {
                STAMP_PATTERNS[s].forEach(pattern => {
                    const regex = createGlobalRegex(pattern);
                    for (const match of text.matchAll(regex)) {
                        const term = String(match[0] || '').trim();
                        if (term.length < 2) continue;
                        perStamp[s].set(term, (perStamp[s].get(term) || 0) + 1);
                    }
                });
            });
        });
        (keywords || []).forEach(kw => {
            const stamp = guessStampFromTerm(kw);
            perStamp[stamp].set(kw, (perStamp[stamp].get(kw) || 0) + 2);
        });

        const chips = [];
        STAMP_ORDER.forEach(s => {
            const rows = [...perStamp[s].entries()]
                .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
                .slice(0, 4);
            rows.forEach(([term]) => {
                chips.push({
                    term,
                    stamp: s,
                    primary: Array.isArray(priorityStamps) && priorityStamps.includes(s),
                    grade: getTermGrade(term)
                });
            });
        });
        return chips;
    }
    function renderKeywordGradeChips(keywordProfile) {
        return keywordProfile.map(k => {
            const stamp = k.stamp || guessStampFromTerm(k.keyword);
            return `<span class="keyword-grade-chip stamp-${stamp} grade-${k.grade}">${escapeHtml(k.keyword)} <em>${k.grade}</em></span>`;
        }).join('');
    }
    function renderStampKeywordChips(chips) {
        return chips.map(item =>
            `<span class="stamp-keyword-chip stamp-${item.stamp} grade-${item.grade}${item.primary ? ' primary' : ''}">${item.stamp} ${escapeHtml(item.term)} <em>${item.grade}</em></span>`
        ).join('');
    }
    function buildRecallCue(q) {
        const correctChoice = q.choices.find(c => c.num === q.answer);
        const seed = uniq([...(correctChoice?.keywords || []), ...(q.keywords || [])]).filter(Boolean).slice(0, 3);
        if (seed.length) return `핵심어 ${seed.join(' · ')} 기준으로 정답 근거를 먼저 말해보세요.`;
        return `${q.topic || '핵심논점'}의 결론을 한 문장으로 먼저 인출하세요.`;
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
        const bag = [
            q.topic || '',
            q.question || '',
            q.text || '',
            ...(q.keywords || [])
        ].join(' ');
        const rule = MEMORY_TIP_RULES.find(r => r.re.test(bag));
        const k1 = (q.keywords || [])[0] || (q.topic || '핵심논점');
        const k2 = (q.keywords || [])[1] || '정답조건';
        const k3 = (q.keywords || [])[2] || '';
        const mode = context.mode || pickTipMode(context.historyKey || '', context.responseSec || 0);
        if (rule) {
            return { mode, label: '🎬 시나리오', text: rule.scene, slogan: rule.slogan };
        }
        // 매칭 규칙 없을 때 동적 생성
        const actions = [
            `네가 시험장 한복판에 서 있는데, 하늘에서 "${k1}"이라 적힌 거대한 돌판이 떨어져 바닥을 쾅 갈라버림. 균열 사이로 "${k2}"라는 빨간 글자가 용암처럼 솟아오름.`,
            `칠흑같은 복도에서 "${k1}"이라는 형광 글씨가 벽에 번져가고, 끝에서 "${k2}"라는 비명이 메아리침. 그 소리가 네 뼈를 진동시킴.`,
            `거대한 시계탑 앞에 서 있는데, 초침이 "${k1}"을 찍을 때마다 벼락이 내려치고, 분침이 "${k2}"를 가리키면 바닥이 갈라짐.`
        ];
        const pick = actions[Math.abs(hashSimple(k1 + k2)) % actions.length];
        const dynamicSlogan = k3
            ? `"${k1} 쾅(원인), ${k2} 솟아(결과), ${k3} 고정!"`
            : `"${k1} 쾅(원인), ${k2} 솟아(결과)!"`;
        return { mode, label: '🎬 시나리오', text: pick, slogan: dynamicSlogan };
    }
    function hashSimple(str) { let h = 0; for (let i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; } return h; }
    function prepareQuestionAnalytics() {
        const keywordScore = {};
        const playable = getPlayableQuestions();
        const analyticsPool = [...playable, ...STATE.candidateQuestions];
        const chapterWeights = buildChapterFrequencyWeights(analyticsPool);

        playable.forEach(q => {
            q.subtopic = q.subtopic || inferSubtopic(q);
            q.coreMaterial = q.coreMaterial || inferCoreMaterial(q);
            const metrics = calcTargetMetrics(q, chapterWeights);
            q.sourceWeight = metrics.sourceWeight;
            q.chapterFrequencyWeight = metrics.chapterFrequencyWeight;
            q.importanceWeight = metrics.importanceWeight;
            q.targetScoreRaw = metrics.raw;
            q.targetScore = metrics.normalized;
            q.targetGrade = metrics.grade;

            const isPrimaryNational = q.exam === '국가직' && q.grade === 9;
            const isNearExam = q.exam === '지방직' || q.exam === '국가직7급' || q.exam === '국회직8급';
            q.isNationalCore = isPrimaryNational || (isNearExam && q.targetScore >= 0.76 && q.importance !== 'B');
            q.isNationalExtended = q.isNationalCore || (isNearExam && q.targetScore >= 0.68);

            const weight = getExamWeight(q.exam) * (q.importance === 'S' ? 1.15 : q.importance === 'A' ? 1.0 : 0.8);
            uniq((q.keywords || []).map(normalizeKeyword).filter(Boolean)).forEach(kw => {
                keywordScore[kw] = (keywordScore[kw] || 0) + weight;
            });
        });

        STATE.candidateQuestions.forEach(q => {
            q.subtopic = q.subtopic || inferSubtopic(q);
            q.coreMaterial = q.coreMaterial || inferCoreMaterial(q);
            const metrics = calcTargetMetrics(q, chapterWeights);
            q.sourceWeight = metrics.sourceWeight;
            q.chapterFrequencyWeight = metrics.chapterFrequencyWeight;
            q.importanceWeight = metrics.importanceWeight;
            q.targetScoreRaw = metrics.raw;
            q.targetScore = metrics.normalized;
            q.targetGrade = metrics.grade;
            const weight = getExamWeight(q.exam) * (q.importance === 'S' ? 1.15 : q.importance === 'A' ? 1.0 : 0.8);
            uniq((q.keywords || []).map(normalizeKeyword).filter(Boolean)).forEach(kw => {
                keywordScore[kw] = (keywordScore[kw] || 0) + weight;
            });
        });

        const sortedKeywords = Object.entries(keywordScore).sort((a, b) => b[1] - a[1]);
        const sCut = sortedKeywords[Math.max(Math.floor(sortedKeywords.length * 0.32) - 1, 0)]?.[1] || 0;
        const aCut = sortedKeywords[Math.max(Math.floor(sortedKeywords.length * 0.68) - 1, 0)]?.[1] || 0;
        const keywordGrades = {};
        sortedKeywords.forEach(([kw, score], idx) => {
            let grade = 'B';
            if (score >= sCut) grade = 'S';
            else if (score >= aCut) grade = 'A';
            keywordGrades[kw] = { score, rank: idx + 1, grade };
        });

        playable.forEach(q => {
            q.keywordProfile = (q.keywords || []).map(kw => {
                const key = normalizeKeyword(kw);
                const info = keywordGrades[key];
                return {
                    keyword: kw,
                    grade: info ? info.grade : 'B',
                    stamp: guessStampFromTerm(kw)
                };
            });
        });
        STATE.candidateQuestions.forEach(q => {
            q.keywordProfile = (q.keywords || []).map(kw => {
                const key = normalizeKeyword(kw);
                const info = keywordGrades[key];
                return {
                    keyword: kw,
                    grade: info ? info.grade : 'B',
                    stamp: guessStampFromTerm(kw)
                };
            });
        });

        STATE.analytics = {
            chapterWeights,
            keywordGrades,
            scopeCounts: {
                national9: getFocusQuestions('national9').length,
                expanded: getFocusQuestions('expanded').length,
                all: getFocusQuestions('all').length,
                candidate: STATE.candidateQuestions.length
            }
        };
    }

    // ===== STORAGE =====
    function loadHistory() {
        try { return JSON.parse(localStorage.getItem(STORAGE.history) || '{}'); } catch { return {}; }
    }
    function saveHistory(h) { localStorage.setItem(STORAGE.history, JSON.stringify(h)); }
    function loadStreak() {
        try { return JSON.parse(localStorage.getItem(STORAGE.streak) || '{"count":0,"lastDate":""}'); } catch { return { count: 0, lastDate: '' }; }
    }
    function saveStreak(s) { localStorage.setItem(STORAGE.streak, JSON.stringify(s)); }
    function loadTraining() {
        try { return JSON.parse(localStorage.getItem(STORAGE.training) || '{"speedMode":false,"recallFirst":true}'); }
        catch { return { speedMode: false, recallFirst: true }; }
    }
    function saveTraining(t) { localStorage.setItem(STORAGE.training, JSON.stringify(t)); }
    function updateStreak() {
        const s = loadStreak();
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (s.lastDate === today) return s.count;
        if (s.lastDate === yesterday) { s.count++; s.lastDate = today; }
        else { s.count = 1; s.lastDate = today; }
        saveStreak(s);
        return s.count;
    }
    function recordAnswer(qid, correct, responseSec) {
        const h = loadHistory();
        if (!h[qid]) h[qid] = { attempts: 0, correct: 0, lastDate: '' };
        h[qid].attempts++;
        if (correct) h[qid].correct++;
        if (typeof responseSec === 'number' && Number.isFinite(responseSec)) {
            h[qid].lastResponseSec = Number(responseSec.toFixed(1));
            h[qid].totalResponseSec = Number(((h[qid].totalResponseSec || 0) + responseSec).toFixed(1));
            h[qid].avgResponseSec = Number((h[qid].totalResponseSec / h[qid].attempts).toFixed(1));
        }
        h[qid].lastDate = new Date().toISOString().slice(0, 10);
        saveHistory(h);
    }
    function getTodayCount() {
        const h = loadHistory();
        const today = new Date().toISOString().slice(0, 10);
        return Object.values(h).filter(v => v.lastDate === today).length;
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

    function speedLabel(sec) {
        if (sec >= SLOW_THRESHOLD_SEC) return '느림';
        if (sec >= 4) return '보통';
        return '빠름';
    }

    function getPressureBudgetSec(mode, importance) {
        let base = mode === 'study'
            ? (STATE.training.speedMode ? 18 : 28)
            : (STATE.training.speedMode ? 6 : 9);
        if (importance === 'S') base += mode === 'study' ? 2 : 1;
        else if (importance === 'B') base -= 1;
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
        if (nodes.timer) {
            nodes.timer.hidden = true;
            nodes.timer.classList.remove('warning', 'danger', 'burnt');
        }
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

    // ===== D-DAY =====
    function calcDday() {
        const exam = new Date(EXAM_DATE);
        const now = new Date();
        now.setHours(0, 0, 0, 0); exam.setHours(0, 0, 0, 0);
        return Math.ceil((exam - now) / 86400000);
    }

    // ===== MOTIVATION BANNER =====
    const MOTIVATION_QUOTES = [
        "세상엔 그냥 되는게 절대 없다. 먹는 것, 자는 것, 집중한 것, 내가 어떻게 했느냐에 따라 결과가 달라질 수 있다.",
        "놀거 다 놀고, 자기 하고싶은거 다 하면서 내가 원하는 것을 얻을거라 생각하지 않는다. 지금 그런 투자가 없으면 절대 미래는 없다.",
        "준비가 잘 됐을때의 공부과정과 조금이라도 소홀했던 공부 준비과정에서 학습력은 엄청난 차이가 난다.",
        "공부를 할 수 있는 지금이 가장 행복할 때다. 누군가는 이 공부를 하고 싶어도 기회조차 주어지지 않았을 것이다.",
        "하루하루를 살얼음판 걷듯, 돌다리 두들기듯, 정말 집중해서 살아가자 하늘이 주신 기적같은 기회다. 항상 감사하자.",
        "나는 프로다. 공부할때 있어서 만큼은 한치의 양보도 없다. 프로의 자세로 공부에 임하자.",
        "인무원여 필유근우 – 멀리 보지 않으면 가까이 근심이 있다.",
        "지금 이 시간, 순간은 내 인생에서 다시 돌아오지 않는다. 정말 소중하고 귀한 시간이다.",
        "\"더 이상 남들이 너를 뒷바라지 하느라 고생하지 않게 해라\" – 전효진",
        "기간이 길어질 수록 부모님은 덥고 추운 환경에서 힘들게 일하게 된다.",
        "지금 이 순간의 집중이 합격의 차이를 만든다. 1초도 허투루 쓰지 마라.",
        "합격한 사람들도 처음엔 막막했다. 차이는 포기하지 않았다는 것뿐이다.",
        "오늘 외운 한 줄이 시험장에서 1점을 만든다. 그 1점이 합격과 불합격을 가른다.",
        "힘들 때 그만두면 영원히 이 자리다. 힘들 때 한 발 더 나가면 합격이다.",
        "시험장에서 '아, 그때 더 할걸' 후회하지 않도록, 지금 이 순간 최선을 다하자.",
        "나를 믿는 사람들을 위해, 나 자신을 위해, 오늘도 한 문제라도 더 풀자."
    ];

    let motivationIndex = 0;
    let motivationTimerId = null;

    function initMotivationBanner() {
        const textEl = document.getElementById('motivationText');
        if (!textEl) return;

        // 랜덤 시작
        motivationIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
        textEl.textContent = MOTIVATION_QUOTES[motivationIndex];

        // 5분(300000ms)마다 전환
        motivationTimerId = setInterval(() => {
            cycleMotivation();
        }, 300000);
    }

    function cycleMotivation() {
        const textEl = document.getElementById('motivationText');
        if (!textEl) return;

        // fade out
        textEl.classList.add('fade-out');
        textEl.classList.remove('fade-in');

        setTimeout(() => {
            motivationIndex = (motivationIndex + 1) % MOTIVATION_QUOTES.length;
            textEl.textContent = MOTIVATION_QUOTES[motivationIndex];

            // fade in
            textEl.classList.remove('fade-out');
            textEl.classList.add('fade-in');

            // 애니메이션 후 클래스 제거
            setTimeout(() => {
                textEl.classList.remove('fade-in');
            }, 800);
        }, 800);
    }

    // ===== INIT =====
    function init() {
        applySupplementData();
        prepareQuestionAnalytics();
        STATE.training = { ...STATE.training, ...loadTraining() };
        renderDday();
        syncJournalLink();
        setupSubjectSwitch();
        setupNav();
        setupFilters();
        syncTrainingOptionsUI();
        populateChapterSelects();
        renderDashboard();
        renderStampPage();
        updateFilteredCounts();
        applyAutoActionFromQuery();
        initMotivationBanner();
    }

    function renderDday() {
        const d = calcDday();
        const el = document.getElementById('ddayBadge');
        el.textContent = d > 0 ? `D-${d}` : d === 0 ? 'D-DAY!' : `D+${Math.abs(d)}`;
    }

    function setupSubjectSwitch() {
        const el = document.getElementById('subjectSwitch');
        if (!el) return;
        el.value = 'law';
        el.addEventListener('change', e => {
            const value = e.target.value;
            if (value === 'admin') {
                window.location.href = 'admin.html';
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
        link.href = 'journal.html?subject=law';
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

    // ===== NAVIGATION =====
    function setupNav() {
        document.getElementById('navTabs').addEventListener('click', e => {
            const tab = e.target.closest('.nav-tab');
            if (!tab) return;
            const page = tab.dataset.page;
            switchPage(page);
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
        document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + page));
        if (page === 'study' && STATE.studyQuestions.length > 0 && document.getElementById('studyArea').style.display !== 'none') {
            renderQuestion();
        }
        if (page === 'ox' && STATE.oxItems.length > 0 && document.getElementById('oxArea').style.display !== 'none') {
            renderOX();
        }
        if (page === 'dashboard') renderDashboard();
        if (page === 'weak') renderWeakAnalysis();
        if (page === 'guide') renderGuide();
    }

    // ===== FILTERS =====
    function setupFilters() {
        document.addEventListener('click', e => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            const filter = btn.dataset.filter;
            const value = btn.dataset.value;
            if (filter === 'imp') STATE.filters.imp = value;
            else if (filter === 'year') STATE.filters.year = value;
            else if (filter === 'ox-imp') STATE.oxFilters.imp = value;
            btn.parentElement.querySelectorAll('.filter-btn').forEach(b => {
                if (b.dataset.filter === filter) b.classList.toggle('active', b.dataset.value === value);
            });
            updateFilteredCounts();
        });
        document.addEventListener('click', e => {
            const reviewBtn = e.target.closest('[data-action="start-review-queue"]');
            if (!reviewBtn) return;
            startReviewQueue();
        });
        const targetFilter = document.getElementById('targetFilter');
        if (targetFilter) {
            targetFilter.addEventListener('change', e => {
                STATE.filters.target = e.target.value;
                updateFilteredCounts();
            });
        }
        const oxTargetFilter = document.getElementById('oxTargetFilter');
        if (oxTargetFilter) {
            oxTargetFilter.addEventListener('change', e => {
                STATE.oxFilters.target = e.target.value;
                updateFilteredCounts();
            });
        }
        document.getElementById('chapterFilter').addEventListener('change', e => { STATE.filters.chapter = e.target.value; updateFilteredCounts(); });
        document.getElementById('sortOrder').addEventListener('change', e => STATE.filters.sort = e.target.value);
        document.getElementById('oxChapterFilter').addEventListener('change', e => { STATE.oxFilters.chapter = e.target.value; updateFilteredCounts(); });
        document.getElementById('oxCount').addEventListener('change', e => STATE.oxFilters.count = e.target.value);
        const speedModeToggle = document.getElementById('speedModeToggle');
        if (speedModeToggle) speedModeToggle.addEventListener('change', applyTrainingOptionsFromUI);
        const recallModeToggle = document.getElementById('recallModeToggle');
        if (recallModeToggle) recallModeToggle.addEventListener('change', applyTrainingOptionsFromUI);
        document.getElementById('startStudy').addEventListener('click', startStudy);
        document.getElementById('startOX').addEventListener('click', startOX);
        document.getElementById('prevQ').addEventListener('click', () => navStudy(-1));
        document.getElementById('nextQ').addEventListener('click', () => navStudy(1));
        document.getElementById('prevOX').addEventListener('click', () => navOX(-1));
        document.getElementById('nextOX').addEventListener('click', () => navOX(1));
    }

    function populateChapterSelects() {
        const usedChs = [...new Set(getPlayableQuestions().map(q => q.chapter))].sort();
        [document.getElementById('chapterFilter'), document.getElementById('oxChapterFilter')].forEach(sel => {
            usedChs.forEach(ch => {
                const opt = document.createElement('option');
                opt.value = ch; opt.textContent = CHAPTERS[ch] || ch;
                sel.appendChild(opt);
            });
        });
    }

    function getFilteredQuestions() {
        let qs = getFocusQuestions(STATE.filters.target).filter(q => {
            if (STATE.filters.imp !== 'all' && q.importance !== STATE.filters.imp) return false;
            if (STATE.filters.year !== 'all' && String(q.year) !== STATE.filters.year) return false;
            if (STATE.filters.chapter !== 'all' && q.chapter !== STATE.filters.chapter) return false;
            return true;
        });
        const h = loadHistory();
        if (STATE.filters.sort === 'random') qs = shuffle(qs);
        else if (STATE.filters.sort === 'importance') qs.sort((a, b) => 'SABC'.indexOf(a.importance) - 'SABC'.indexOf(b.importance));
        else if (STATE.filters.sort === 'weak') qs.sort((a, b) => getAccuracy(h, a.id) - getAccuracy(h, b.id));
        else if (STATE.filters.sort === 'review') qs.sort((a, b) => calcReviewPriority(b, h) - calcReviewPriority(a, h));
        else if (STATE.filters.sort === 'year-desc') qs.sort((a, b) => b.year - a.year);
        return qs;
    }

    function getFilteredOX() {
        let items = [];
        getFocusQuestions(STATE.oxFilters.target).forEach(q => {
            if (STATE.oxFilters.imp !== 'all' && q.importance !== STATE.oxFilters.imp) return;
            if (STATE.oxFilters.chapter !== 'all' && q.chapter !== STATE.oxFilters.chapter) return;
            q.choices.forEach((c, i) => {
                const item = generateOXFromChoice(q, i);
                item.targetGrade = q.targetGrade;
                item.targetScore = q.targetScore;
                item.subtopic = q.subtopic;
                item.coreMaterial = q.coreMaterial;
                item.keywordProfile = q.keywordProfile;
                items.push(item);
            });
        });
        items = shuffle(items);
        const max = STATE.oxFilters.count === 'all' ? items.length : parseInt(STATE.oxFilters.count);
        return items.slice(0, max);
    }

    function updateFilteredCounts() {
        const playableTotal = getPlayableQuestions().length;
        const studyCount = getFilteredQuestions().length;
        const studyScopeAll = getFocusQuestions(STATE.filters.target).length;
        const studyExcluded = playableTotal - studyScopeAll;
        document.getElementById('filteredCount').textContent = `(${studyCount}문항 선택됨 · 범위외 ${studyExcluded}문항 제외)`;
        const oxCount = getFilteredOX().length;
        const oxScopeAll = getFocusQuestions(STATE.oxFilters.target).length;
        const oxExcluded = playableTotal - oxScopeAll;
        document.getElementById('oxFilteredCount').textContent = `(${oxCount}문항 생성됨 · 범위외 ${oxExcluded}문항 제외)`;

        const studyScopeInfo = document.getElementById('targetScopeInfo');
        if (studyScopeInfo) {
            studyScopeInfo.textContent = `${studyScopeAll}문항 사용 / ${studyExcluded}문항 제외`;
        }
        const oxScopeInfo = document.getElementById('oxTargetScopeInfo');
        if (oxScopeInfo) {
            oxScopeInfo.textContent = `${oxScopeAll}문항 사용 / ${oxExcluded}문항 제외`;
        }
    }

    function getAccuracy(h, id) {
        const r = h['q' + id] || h['ox' + id];
        if (!r || r.attempts === 0) return 0.5;
        return r.correct / r.attempts;
    }
    function calcReviewPriority(q, history) {
        const row = history['q' + q.id];
        const attempts = row?.attempts || 0;
        const acc = attempts > 0 ? row.correct / attempts : 0;
        const avgSec = row?.avgResponseSec || 0;
        const impWeight = q.importance === 'S' ? 1.15 : q.importance === 'A' ? 1.0 : 0.82;
        let score = attempts === 0 ? 2.3 : (1 - acc) * 2.1;
        if (attempts >= 2 && acc < 0.7) score += 0.6;
        if (avgSec >= SLOW_THRESHOLD_SEC) score += 0.5 + ((avgSec - SLOW_THRESHOLD_SEC) / 5);
        return Number((score * impWeight).toFixed(3));
    }
    function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }

    // ===== DASHBOARD =====
    function renderDashboard() {
        const h = loadHistory();
        const coreQuestions = getFocusQuestions('national9');
        const totalAnswered = Object.keys(h).length;
        const totalCorrect = Object.values(h).reduce((s, v) => s + v.correct, 0);
        const totalAttempts = Object.values(h).reduce((s, v) => s + v.attempts, 0);
        const accuracy = totalAttempts > 0 ? Math.round(totalCorrect / totalAttempts * 100) : 0;
        document.getElementById('statTotal').textContent = `${totalAnswered} / ${coreQuestions.length * 5}`;
        document.getElementById('statAccuracy').textContent = totalAttempts > 0 ? accuracy + '%' : '--%';
        document.getElementById('statToday').textContent = getTodayCount();
        document.getElementById('statStreak').textContent = loadStreak().count;
        renderChapterGrid();
    }

    function renderChapterGrid() {
        const h = loadHistory();
        const grid = document.getElementById('chapterGrid');
        const chapterStats = {};
        getFocusQuestions('national9').forEach(q => {
            if (!chapterStats[q.chapter]) chapterStats[q.chapter] = { total: 0, answered: 0, correct: 0 };
            chapterStats[q.chapter].total++;
            const r = h['q' + q.id];
            if (r) { chapterStats[q.chapter].answered++; if (r.correct > 0) chapterStats[q.chapter].correct++; }
        });
        grid.innerHTML = Object.entries(chapterStats).sort((a, b) => a[0].localeCompare(b[0])).map(([ch, s]) => {
            const pct = s.total > 0 ? Math.round(s.answered / s.total * 100) : 0;
            return `<div class="chapter-card" onclick="filterByChapter('${ch}')">
      <div class="ch-name">${CHAPTERS[ch] || ch}</div>
      <div class="ch-count">${s.answered}/${s.total} (${pct}%)</div>
    </div>`;
        }).join('');
    }

    window.filterByChapter = function (ch) {
        STATE.filters.chapter = ch;
        document.getElementById('chapterFilter').value = ch;
        switchPage('study');
        updateFilteredCounts();
    };

    function startReviewQueue() {
        switchPage('study');
        STATE.filters.target = 'national9';
        STATE.filters.sort = 'review';
        STATE.filters.chapter = 'all';
        STATE.filters.imp = 'all';
        STATE.filters.year = 'all';

        const target = document.getElementById('targetFilter');
        const chapter = document.getElementById('chapterFilter');
        const sort = document.getElementById('sortOrder');
        if (target) target.value = 'national9';
        if (chapter) chapter.value = 'all';
        if (sort) sort.value = 'review';
        document.querySelectorAll('.filter-btn[data-filter="imp"]').forEach(b => {
            b.classList.toggle('active', b.dataset.value === 'all');
        });
        document.querySelectorAll('.filter-btn[data-filter="year"]').forEach(b => {
            b.classList.toggle('active', b.dataset.value === 'all');
        });
        updateFilteredCounts();
        startStudy();
    }

    // ===== STUDY MODE =====
    function startStudy() {
        clearAutoNext();
        clearPressureTicker();
        hidePressureTimer('ox');
        STATE.studyQuestions = getFilteredQuestions();
        if (STATE.studyQuestions.length === 0) { alert('선택된 조건에 해당하는 문제가 없습니다.'); return; }
        STATE.studyIndex = 0;
        STATE.studyAnswers = {};
        STATE.studyResponseSec = {};
        STATE.studyReveal = {};
        STATE.activeStudyQid = null;
        STATE.studyStartTs = 0;
        document.getElementById('studySetup').style.display = 'none';
        document.getElementById('studyArea').style.display = 'block';
        document.getElementById('studyResult').style.display = 'none';
        renderQuestion();
    }

    function renderQuestion() {
        const q = STATE.studyQuestions[STATE.studyIndex];
        if (!q) { showStudyResult(); return; }
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
        const area = document.getElementById('questionArea');
        let html = `<div class="q-card">
    <div class="q-meta">
      <span class="q-number">${STATE.studyIndex + 1}</span>
      <span class="q-badge year">${q.year} ${q.exam}</span>
      <span class="q-badge chapter">${CHAPTERS[q.chapter] || q.chapter}</span>
      <span class="q-badge imp-${q.importance}">${q.importance}급</span>
      <span class="q-badge fit-${q.targetGrade || 'B'}">국가9 적합 ${q.targetGrade || 'B'}</span>
    </div>
    <div class="q-text">${q.question}</div>
    <div class="q-focus-note">소주제: ${escapeHtml(q.subtopic || q.topic)} · 핵심소재: ${escapeHtml(q.coreMaterial || '')}</div>`;
        if (q.subItems) {
            html += `<div class="q-subitems">${q.subItems.map(s => `<p>${s}</p>`).join('')}</div>`;
        }

        const choicesVisible = answered !== undefined || !STATE.training.recallFirst || STATE.studyReveal[q.id];
        if (choicesVisible) {
            html += `<div class="choices-list">`;
            q.choices.forEach(c => {
                let cls = 'choice-btn';
                if (answered !== undefined) {
                    cls += ' disabled';
                    if (c.num === q.answer) cls += ' correct';
                    else if (c.num === answered) cls += ' incorrect';
                }
                html += `<div class="${cls}" data-num="${c.num}" onclick="selectChoice(${q.id}, ${c.num})">
      <div class="choice-num">${c.num}</div>
      <div class="choice-text">${answered !== undefined ? highlightStamp(c.text, c.stamp, q.keywords) : escapeHtml(c.text)}</div>
    </div>`;
            });
            html += `</div>`;
        } else {
            html += `<div class="recall-prep">
      <div class="recall-title">🧠 인출 선행 5초</div>
      <div class="recall-cue">${escapeHtml(buildRecallCue(q))}</div>
      <button class="btn btn-secondary recall-btn" type="button" onclick="revealChoices(${q.id})">선지 보기</button>
    </div>`;
        }
        if (answered !== undefined) {
            const isCorrect = answered === q.answer;
            html += renderAnswerPanel(q, isCorrect, STATE.studyResponseSec[q.id] || 0);
        }
        html += `</div>`;
        area.innerHTML = html;
        document.getElementById('qCounter').textContent = `${STATE.studyIndex + 1} / ${STATE.studyQuestions.length}`;
        if (answered !== undefined) {
            lockPressureTimer('study', STATE.studyResponseSec[q.id] || getElapsedSec(STATE.studyStartTs));
        }
    }

    window.revealChoices = function (qid) {
        if (!qid) return;
        STATE.studyReveal[qid] = true;
        renderQuestion();
    };

    window.selectChoice = function (qid, num) {
        if (STATE.studyAnswers[qid] !== undefined) return;
        STATE.studyAnswers[qid] = num;
        const q = STATE.studyQuestions.find(q => q.id === qid);
        const elapsed = getElapsedSec(STATE.studyStartTs);
        STATE.studyResponseSec[qid] = elapsed;
        lockPressureTimer('study', elapsed);
        const correct = num === q.answer;
        recordAnswer('q' + qid, correct, elapsed);
        logJournalAttempt({
            subject: 'law',
            mode: 'study',
            qid: `q${qid}`,
            chapter: q.chapter,
            topic: q.subtopic || q.topic,
            importance: q.importance,
            correct,
            sec: elapsed,
            source: 'law-study'
        });
        updateStreak();
        renderQuestion();
        if (STATE.training.speedMode) {
            clearAutoNext();
            STATE.autoNextTimerId = setTimeout(() => navStudy(1), 650);
        }
    };

    function renderAnswerPanel(q, isCorrect, responseSec) {
        const correctChoice = (q.choices || []).find(c => c.no === q.answer);
        const memorySourceText = (correctChoice && correctChoice.text ? correctChoice.text : q.question) || '';
        const kwEmojis = buildKeywordMemoryLine(memorySourceText, q.keywords || []);
        const metacogKey = `metacog_q${q.id}`;
        let html = `<div class="answer-panel ${isCorrect ? 'correct-panel' : 'incorrect-panel'}">
    <div class="answer-result ${isCorrect ? 'correct' : 'incorrect'}">
      ${isCorrect ? '✅ 정답!' : '❌ 오답'} 정답: ${q.answer}번
    </div>
    <div class="answer-explain"><strong>⏱ 선택시간:</strong> ${responseSec.toFixed(1)}초 (${speedLabel(responseSec)})</div>
    <div class="answer-explain">
      <strong>📌 키워드:</strong> ${(q.keywords || []).join(', ')}
    </div>
    ${kwEmojis ? `<div class="keyword-memory-line">
      <div class="kml-title">💡 한 줄 기억</div>
      <div class="kml-summary">${kwEmojis}</div>
    </div>` : ''}
    ${renderMetacogPanel(metacogKey, responseSec)}
    </div>`;
        return html;
    }

    // 선지 문장에서 주체/기간/요건/효과/수식어 키워드만 뽑아 한 줄 기억 생성
    function buildKeywordMemoryLine(sourceText, fallbackKeywords) {
        const text = String(sourceText || '').replace(/\s+/g, ' ').trim();
        const words = Array.isArray(fallbackKeywords) ? fallbackKeywords.filter(Boolean) : [];
        if (!text && words.length === 0) return '';

        // 키워드별 이모지 매핑 (복구)
        const KEYWORD_EMOJI_MAP = {
            '행정청': '🏛️', '처분청': '🏛️', '법원': '⚖️', '대법원': '🏛️', '헌법재판소': '📜',
            '원고': '🧑‍💼', '피고': '🛡️', '당사자': '👥', '국가': '🇰🇷', '지방자치단체': '🏢',
            '처분': '📋', '처분성': '🚪', '허가': '✅', '인가': '🔑', '신고': '📝',
            '취소': '🧹', '철회': '✂️', '무효': '💀', '유효': '💚',
            '재량': '🎯', '기속': '🔒', '일탈': '💥', '남용': '🐍',
            '신뢰보호': '🛡️', '소급': '⏪', '제소기간': '⏰', '제척기간': '⏳', '불변기간': '⌛',
            '고시': '📰', '공고': '📢', '통지': '📩', '송달': '📬',
            '기간': '📅', '기한': '⌛', '효력': '⚡', '발생': '🌟', '소멸': '💨', '상실': '⚡',
            '소멸시효': '💨', '집행정지': '🛑', '가처분': '✋',
            '손실보상': '💰', '손해배상': '🩸', '부관': '🐍', '조건': '⚠️',
            '부담': '⛓️', '행정입법': '📚', '법규명령': '📕', '행정규칙': '📘',
            '행정계획': '🗺️', '계획재량': '🧭', '변경': '🔄',
            '항고소송': '⚔️', '당사자소송': '🤝', '취소소송': '🧹⚖️', '무효확인소송': '⚖️💀',
            '사정판결': '⚖️🛡️', '석명권': '🗣️', '직권': '🧭', '증거조사': '🔍',
            '하자의승계': '🔗', '대집행': '🏗️', '행정대집행': '🚜',
            '원고적격': '🎫', '소의이익': '🎟️', '위법': '🚨', '적법': '✅',
            '제기': '📤', '청구': '🙏', '인정': '👍', '부정': '👎',
            '확대': '📈', '축소': '📉', '제한': '🚧', '금지': '🚫'
        };

        const emojiFor = (phrase, fallbackEmoji) => {
            for (const [key, emoji] of Object.entries(KEYWORD_EMOJI_MAP)) {
                if (phrase.includes(key)) return emoji;
            }
            return fallbackEmoji;
        };

        const pickFromPatterns = (patterns) => {
            for (const re of patterns) {
                const m = text.match(re);
                if (m && m[0]) return m[0].trim();
            }
            return '';
        };

        const pickFromKeywords = (patterns) => {
            for (const kw of words) {
                for (const re of patterns) {
                    const m = String(kw).match(re);
                    if (m && m[0]) return m[0].trim();
                }
            }
            return '';
        };

        const subject = pickFromPatterns([
            /주장\s*·?\s*입증책임은\s*[^,.;]+/,
            /[^,.;]{0,16}처분청[에은는이가]?/,
            /법원이\s*직권으로/,
            /[가-힣A-Za-z0-9·]+(?:청|기관|위원회|법원|법인|국가|지방자치단체)/
        ]) || pickFromKeywords([/(?:원고|피고|행정청|처분청|법원|국가|지방자치단체)/]);

        const period = pickFromPatterns([
            /\d+\s*년\s*(?:이내|내)?/,
            /\d+\s*개월\s*(?:이내|내)?/,
            /\d+\s*일\s*(?:이내|내)?/,
            /(?:제소|제척|불변|효력)기간/
        ]) || pickFromKeywords([/(?:제소기간|제척기간|불변기간|효력기간|기간|기한)/]);

        const requirement = pickFromPatterns([
            /사정판결을\s*할\s*사정/,
            /[가-힣A-Za-z0-9·]+(?:신청|청구|허가|인가|신고)(?:\s*(?:미|누락|흠결))?/,
            /[가-힣A-Za-z0-9·]+(?:요건|사유|절차|의무|기준|적격)/
        ]) || pickFromKeywords([/(?:신청|청구|허가|인가|신고|요건|사유|절차|의무|기준|적격)/]);

        const effect = pickFromPatterns([
            /사정판결을\s*할\s*수도\s*있다/,
            /효력을\s*상실한다/,
            /효력을\s*잃는다/,
            /효력이\s*없다/,
            /(?:성립|발생|소멸|취소|무효|위법|적법)(?:한다|된다|이다|다)/
        ]) || pickFromKeywords([/(?:효력|상실|소멸|취소|무효|위법|적법)/]);

        const modifier = pickFromPatterns([
            /명백한\s*주장(?:이)?\s*없는\s*경우(?:에도)?/,
            /직권으로/,
            /직접|간접|원칙|예외|중대한|명백한|재량|기속|현저히/
        ]) || pickFromKeywords([/(?:직접|간접|원칙|예외|중대한|명백한|재량|기속|현저히)/]);

        const pieces = [];
        if (requirement) pieces.push(`${emojiFor(requirement, '📌')}${highlightStamp(requirement, [], [requirement])}`);
        if (subject && !pieces.some(p => p.includes(subject))) pieces.push(`${emojiFor(subject, '👤')}${highlightStamp(subject, [], [subject])}`);
        if (modifier) pieces.push(`${emojiFor(modifier, '✨')}${highlightStamp(modifier, [], [modifier])}`);
        if (period) pieces.push(`${emojiFor(period, '📅')}${highlightStamp(period, [], [period])}`);
        if (effect) pieces.push(`${emojiFor(effect, '⚡')}${highlightStamp(effect, [], [effect])}`);

        if (pieces.length === 0 && words.length > 0) {
            const fallback = words.slice(0, 4).map(kw => `${emojiFor(kw, '🔑')}${highlightStamp(kw, [], [kw])}`);
            return fallback.join(' → ') + ' 기억.';
        }

        return pieces.join(' → ') + ' 기억.';
    }

    // 핵심 키워드 자동 하이라이트 시스템 (키워드+조사 자연스러운 연결)
    function highlightStamp(text, stamps, keywords) {
        let result = escapeHtml(text);
        // 조사 패턴: 키워드 뒤에 자연스럽게 붙는 한국어 조사들
        const JOSA_PATTERN = '(?:[이가은는을를의에서도와과로부터만뿐까지조차마저라도에서의에서는]|으로|에게|한테|에는|이나|까지|뿐만|뿐이|아니라|에까지)*';

        // 1단계: 정답 키워드를 우선 하이라이트 (조사 포함)
        if (keywords && keywords.length > 0) {
            // 긴 키워드부터 처리 (겹침 방지)
            const sortedKw = [...keywords].sort((a, b) => b.length - a.length);
            sortedKw.forEach(kw => {
                const escaped = escapeRegExp(kw);
                const kwRegex = new RegExp(escaped + JOSA_PATTERN, 'g');
                result = wrapTextNodes(result, kwRegex, match =>
                    `<span class="keyword-highlight">${match}</span>`
                );
            });
        }

        return result;
    }

    // ===== 메타인지 태깅 시스템 =====
    const METACOG_TAGS = [
        { id: 'unknown', emoji: '❓', label: '몰랐던 것' },
        { id: 'confused', emoji: '🔀', label: '헷갈린 개념' },
        { id: 'slow', emoji: '⏳', label: '시간 부족' },
        { id: 'trap', emoji: '🪤', label: '함정에 걸림' },
        { id: 'lucky', emoji: '🍀', label: '찍어서 맞춤' },
        { id: 'review', emoji: '🔁', label: '반복 필요' }
    ];

    function getMetacogStorage() {
        try {
            return JSON.parse(localStorage.getItem('stamp_metacog') || '{}');
        } catch { return {}; }
    }

    function saveMetacogData(key, data) {
        const store = getMetacogStorage();
        store[key] = { ...data, updatedAt: Date.now() };
        localStorage.setItem('stamp_metacog', JSON.stringify(store));
    }

    function renderMetacogPanel(key, responseSec) {
        const saved = getMetacogStorage()[key] || {};
        const activeTags = saved.tags || [];
        const note = saved.note || '';
        const slowBadge = responseSec > SLOW_THRESHOLD_SEC
            ? `<span class="metacog-time-badge">⚠️ ${responseSec.toFixed(1)}초 소요</span>`
            : '';

        let tagsHtml = METACOG_TAGS.map(tag => {
            const isActive = activeTags.includes(tag.id);
            return `<label class="metacog-tag ${isActive ? 'active' : ''}" data-metacog-key="${key}" data-tag-id="${tag.id}" onclick="toggleMetacogTag(this)">
                <span class="tag-check">${isActive ? '✓' : ''}</span>
                <span>${tag.emoji} ${tag.label}</span>
            </label>`;
        }).join('');

        return `<div class="metacog-panel">
            <div class="metacog-title">🧠 메타인지 태깅 ${slowBadge}</div>
            <div class="metacog-tags">${tagsHtml}</div>
            <textarea class="metacog-note" placeholder="왜 틀렸는지, 다음에 주의할 점을 메모하세요…" data-metacog-key="${key}" oninput="saveMetacogNote(this)">${escapeHtml(note)}</textarea>
            <div class="metacog-saved" id="metacog-saved-${key.replace(/[^a-zA-Z0-9_]/g, '_')}"></div>
        </div>`;
    }

    window.toggleMetacogTag = function (el) {
        const key = el.dataset.metacogKey;
        const tagId = el.dataset.tagId;
        const store = getMetacogStorage();
        const data = store[key] || { tags: [], note: '' };
        const idx = data.tags.indexOf(tagId);
        if (idx >= 0) {
            data.tags.splice(idx, 1);
            el.classList.remove('active');
            el.querySelector('.tag-check').textContent = '';
        } else {
            data.tags.push(tagId);
            el.classList.add('active');
            el.querySelector('.tag-check').textContent = '✓';
        }
        saveMetacogData(key, data);
        showMetacogSaved(key);
    };

    window.saveMetacogNote = function (textarea) {
        const key = textarea.dataset.metacogKey;
        const store = getMetacogStorage();
        const data = store[key] || { tags: [] };
        data.note = textarea.value;
        saveMetacogData(key, data);
        showMetacogSaved(key);
    };

    function showMetacogSaved(key) {
        const id = 'metacog-saved-' + key.replace(/[^a-zA-Z0-9_]/g, '_');
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = '✓ 저장됨';
        el.classList.add('show');
        clearTimeout(el._timeout);
        el._timeout = setTimeout(() => { el.classList.remove('show'); }, 1500);
    }

    function navStudy(dir) {
        clearAutoNext();
        const next = STATE.studyIndex + dir;
        if (next < 0) return;
        if (next >= STATE.studyQuestions.length) { showStudyResult(); return; }
        STATE.studyIndex = next;
        renderQuestion();
    }

    function showStudyResult() {
        clearPressureTicker();
        hidePressureTimer('study');
        document.getElementById('studyArea').style.display = 'none';
        const total = STATE.studyQuestions.length;
        let correct = 0;
        STATE.studyQuestions.forEach(q => { if (STATE.studyAnswers[q.id] === q.answer) correct++; });
        const pct = Math.round(correct / total * 100);
        const secList = Object.values(STATE.studyResponseSec);
        const avgSec = secList.length ? (secList.reduce((a, b) => a + b, 0) / secList.length).toFixed(1) : '0.0';
        const cls = pct >= 80 ? 'good' : pct >= 60 ? 'mid' : 'bad';
        const rd = document.getElementById('studyResult');
        rd.style.display = 'block';
        rd.innerHTML = `<div class="result-card">
    <h2 style="font-size:20px;font-weight:800;">📊 학습 결과</h2>
    <div class="result-score ${cls}">${pct}%</div>
    <div class="result-detail">
      <div class="result-item"><div class="ri-label">총 문항</div><div class="ri-value">${total}</div></div>
      <div class="result-item"><div class="ri-label">정답</div><div class="ri-value" style="color:var(--correct)">${correct}</div></div>
      <div class="result-item"><div class="ri-label">오답</div><div class="ri-value" style="color:var(--incorrect)">${total - correct}</div></div>
    </div>
    <div class="answer-explain" style="margin-bottom:12px;"><strong>평균 선택시간:</strong> ${avgSec}초</div>
    <button class="btn btn-primary" onclick="resetStudy()">🔄 다시 풀기</button>
    <button class="btn btn-secondary" onclick="reviewWrong()" style="margin-left:8px;">📝 오답만 다시</button>
  </div>`;
    }

    window.resetStudy = function () {
        clearAutoNext();
        clearPressureTicker();
        hidePressureTimer('study');
        document.getElementById('studyResult').style.display = 'none';
        document.getElementById('studySetup').style.display = 'block';
    };
    window.reviewWrong = function () {
        clearAutoNext();
        const wrong = STATE.studyQuestions.filter(q => STATE.studyAnswers[q.id] !== q.answer);
        if (wrong.length === 0) { alert('오답이 없습니다! 🎉'); return; }
        STATE.studyQuestions = wrong;
        STATE.studyIndex = 0;
        STATE.studyAnswers = {};
        STATE.studyResponseSec = {};
        STATE.studyReveal = {};
        STATE.activeStudyQid = null;
        STATE.studyStartTs = 0;
        STATE.studyPressureBudgetSec = 0;
        document.getElementById('studyResult').style.display = 'none';
        document.getElementById('studyArea').style.display = 'block';
        renderQuestion();
    };

    // ===== OX MODE =====
    function startOX() {
        clearAutoNext();
        clearPressureTicker();
        hidePressureTimer('study');
        STATE.oxItems = getFilteredOX();
        if (STATE.oxItems.length === 0) { alert('선택된 조건에 해당하는 OX 문제가 없습니다.'); return; }
        STATE.oxIndex = 0;
        STATE.oxAnswers = {};
        STATE.oxResponseSec = {};
        STATE.activeOxKey = null;
        STATE.oxStartTs = 0;
        document.getElementById('oxSetup').style.display = 'none';
        document.getElementById('oxArea').style.display = 'block';
        document.getElementById('oxResult').style.display = 'none';
        renderOX();
    }

    function renderOX() {
        const item = STATE.oxItems[STATE.oxIndex];
        if (!item) { showOXResult(); return; }
        const key = `ox_${item.questionId}_${STATE.oxIndex}`;
        const answered = STATE.oxAnswers[key];
        if (answered === undefined) {
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
        }
        const el = document.getElementById('oxQuestion');
        let html = `<div class="ox-card">
    <div class="q-meta">
      <span class="q-badge year">${item.year} ${item.exam}</span>
      <span class="q-badge chapter">${CHAPTERS[item.chapter] || item.chapter}</span>
      <span class="q-badge imp-${item.importance}">${item.importance}급</span>
      <span class="q-badge fit-${item.targetGrade || 'B'}">국가9 적합 ${item.targetGrade || 'B'}</span>
    </div>
    <div class="q-focus-note">소주제: ${escapeHtml(item.subtopic || item.topic || '')} · 핵심소재: ${escapeHtml(item.coreMaterial || '')}</div>
    <div class="ox-statement">${answered !== undefined ? highlightStamp(item.text, item.stamp, item.keywords) : escapeHtml(item.text)}</div>
    <div class="ox-buttons">
      <button class="ox-btn o ${answered === true ? 'selected' : ''}" onclick="selectOX(true)" ${answered !== undefined ? 'disabled' : ''}>⭕</button>
      <button class="ox-btn x ${answered === false ? 'selected' : ''}" onclick="selectOX(false)" ${answered !== undefined ? 'disabled' : ''}>❌</button>
    </div>`;
        if (answered !== undefined) {
            const isCorrect = answered === item.answer;
            const kwEmojis = buildKeywordMemoryLine(item.text || '', item.keywords || []);
            html += `<div class="answer-panel ${isCorrect ? 'correct-panel' : 'incorrect-panel'}" style="margin-top:16px;">
      <div class="answer-result ${isCorrect ? 'correct' : 'incorrect'}">
        ${isCorrect ? '✅ 정답!' : '❌ 오답'} 이 선지는 ${item.answer ? '⭕ O (맞는 내용)' : '❌ X (틀린 내용)'}
      </div>
      <div class="answer-explain"><strong>⏱ 선택시간:</strong> ${(STATE.oxResponseSec[key] || 0).toFixed(1)}초 (${speedLabel(STATE.oxResponseSec[key] || 0)})</div>
      <div class="answer-explain"><strong>📌 키워드:</strong> ${(item.keywords || []).join(', ')}</div>
      ${kwEmojis ? `<div class="keyword-memory-line">
        <div class="kml-title">💡 한 줄 기억</div>
        <div class="kml-summary">${kwEmojis}</div>
      </div>` : ''}
      ${renderMetacogPanel('metacog_ox_' + item.questionId + '_' + STATE.oxIndex, STATE.oxResponseSec[key] || 0)}
    </div>`;
        }
        html += `</div>`;
        el.innerHTML = html;
        document.getElementById('oxCounter').textContent = `${STATE.oxIndex + 1} / ${STATE.oxItems.length}`;
        if (answered !== undefined) {
            lockPressureTimer('ox', STATE.oxResponseSec[key] || getElapsedSec(STATE.oxStartTs));
        }
    }

    window.selectOX = function (val) {
        const item = STATE.oxItems[STATE.oxIndex];
        const key = `ox_${item.questionId}_${STATE.oxIndex}`;
        if (STATE.oxAnswers[key] !== undefined) return;
        STATE.oxAnswers[key] = val;
        const elapsed = getElapsedSec(STATE.oxStartTs);
        STATE.oxResponseSec[key] = elapsed;
        lockPressureTimer('ox', elapsed);
        const correct = val === item.answer;
        recordAnswer('ox_' + item.questionId + '_' + STATE.oxIndex, correct, elapsed);
        logJournalAttempt({
            subject: 'law',
            mode: 'ox',
            qid: key,
            chapter: item.chapter,
            topic: item.subtopic || item.topic,
            importance: item.importance,
            correct,
            sec: elapsed,
            tags: Array.isArray(item.stamp) ? item.stamp.map(s => `STAMP_${s}`) : [],
            source: 'law-ox'
        });
        updateStreak();
        renderOX();
        if (STATE.training.speedMode) {
            clearAutoNext();
            STATE.autoNextTimerId = setTimeout(() => navOX(1), 500);
        }
    };

    function logJournalAttempt(payload) {
        if (!window.StudyJournal || typeof window.StudyJournal.logAttempt !== 'function') return null;
        return window.StudyJournal.logAttempt(payload);
    }

    function navOX(dir) {
        clearAutoNext();
        const next = STATE.oxIndex + dir;
        if (next < 0) return;
        if (next >= STATE.oxItems.length) { showOXResult(); return; }
        STATE.oxIndex = next;
        renderOX();
    }

    function showOXResult() {
        clearPressureTicker();
        hidePressureTimer('ox');
        document.getElementById('oxArea').style.display = 'none';
        const total = STATE.oxItems.length;
        let correct = 0;
        Object.entries(STATE.oxAnswers).forEach(([key, val]) => {
            const idx = parseInt(key.split('_').pop());
            const item = STATE.oxItems[idx];
            if (item && val === item.answer) correct++;
        });
        const pct = Math.round(correct / total * 100);
        const secList = Object.values(STATE.oxResponseSec);
        const avgSec = secList.length ? (secList.reduce((a, b) => a + b, 0) / secList.length).toFixed(1) : '0.0';
        const cls = pct >= 80 ? 'good' : pct >= 60 ? 'mid' : 'bad';
        const rd = document.getElementById('oxResult');
        rd.style.display = 'block';
        rd.innerHTML = `<div class="result-card">
    <h2 style="font-size:20px;font-weight:800;">⭕ OX 훈련 결과</h2>
    <div class="result-score ${cls}">${pct}%</div>
    <div class="result-detail">
      <div class="result-item"><div class="ri-label">총 문항</div><div class="ri-value">${total}</div></div>
      <div class="result-item"><div class="ri-label">정답</div><div class="ri-value" style="color:var(--correct)">${correct}</div></div>
      <div class="result-item"><div class="ri-label">오답</div><div class="ri-value" style="color:var(--incorrect)">${total - correct}</div></div>
    </div>
    <div class="answer-explain" style="margin-bottom:12px;"><strong>평균 선택시간:</strong> ${avgSec}초</div>
    <button class="btn btn-primary" onclick="resetOX()">🔄 다시 풀기</button>
  </div>`;
    }

    window.resetOX = function () {
        clearAutoNext();
        clearPressureTicker();
        hidePressureTimer('ox');
        document.getElementById('oxResult').style.display = 'none';
        document.getElementById('oxSetup').style.display = 'block';
    };

    // ===== STAMP PAGE =====
    function renderStampPage() {
        const el = document.getElementById('stampCards');
        const stampNames = { S: 'Subject(주체)', T: 'Time(시점)', A: 'Action(행위)', M: 'Modifier(수식어)', P: 'Predicate(결론)' };
        let html = '<h3 style="font-size:16px;font-weight:800;margin-bottom:12px;">🎯 함정 패턴 카드</h3>';
        TRAP_PATTERNS.forEach(tp => {
            html += `<div class="q-card" style="margin-bottom:12px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span class="q-badge imp-S">${tp.freq}</span>
        <strong style="font-size:15px;">${tp.name}</strong>
      </div>
      <p style="font-size:14px;color:var(--text-secondary);line-height:1.7;">${tp.desc}</p>
    </div>`;
        });
        html += '<h3 style="font-size:16px;font-weight:800;margin:24px 0 12px;">📖 STAMP 원칙 상세</h3>';
        STAMP_CARDS.forEach(sc => {
            html += `<div class="q-card" style="margin-bottom:12px;border-left:3px solid var(--stamp-${sc.type.toLowerCase()});">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span class="stamp-tag ${sc.type}">${sc.type} ${stampNames[sc.type] || ''}</span>
        <strong style="font-size:15px;">${sc.title}</strong>
      </div>
      <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">📋 규칙: ${sc.rule}</p>
      <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;">💡 팁: ${sc.tip}</p>
      <p style="font-size:13px;color:var(--accent-rose);line-height:1.7;">⚠️ 함정: ${sc.trap}</p>
    </div>`;
        });
        el.innerHTML = html;
    }

    // ===== WEAK ANALYSIS =====
    function renderWeakAnalysis() {
        const h = loadHistory();
        const el = document.getElementById('weakAnalysis');
        const analysisPool = getFocusQuestions('national9');
        if (Object.keys(h).length === 0) {
            el.innerHTML = '<div class="q-card"><p style="text-align:center;color:var(--text-muted);padding:40px;">아직 학습 데이터가 없습니다. 먼저 문제를 풀어보세요!</p></div>';
            return;
        }
        // Chapter accuracy
        const chStats = {};
        analysisPool.forEach(q => {
            if (!chStats[q.chapter]) chStats[q.chapter] = { total: 0, correct: 0 };
            const r = h['q' + q.id];
            if (r) { chStats[q.chapter].total += r.attempts; chStats[q.chapter].correct += r.correct; }
        });
        let html = '<div class="q-card"><h3 style="font-size:16px;font-weight:800;margin-bottom:16px;">📊 단원별 정답률</h3>';
        Object.entries(chStats).filter(([, s]) => s.total > 0).sort((a, b) => {
            const aR = a[1].correct / a[1].total; const bR = b[1].correct / b[1].total; return aR - bR;
        }).forEach(([ch, s]) => {
            const pct = Math.round(s.correct / s.total * 100);
            const color = pct >= 80 ? 'var(--correct)' : pct >= 60 ? 'var(--accent-amber)' : 'var(--incorrect)';
            html += `<div class="weak-bar">
      <div class="wb-label">${CHAPTERS[ch] || ch}</div>
      <div class="wb-track"><div class="wb-fill" style="width:${pct}%;background:${color};"></div></div>
      <div class="wb-val" style="color:${color}">${pct}%</div>
    </div>`;
        });
        html += '</div>';

        // STAMP difficulty
        const stampStats = { S: { total: 0, wrong: 0 }, T: { total: 0, wrong: 0 }, A: { total: 0, wrong: 0 }, M: { total: 0, wrong: 0 }, P: { total: 0, wrong: 0 } };
        analysisPool.forEach(q => {
            q.choices.forEach(c => {
                c.stamp.forEach(s => { stampStats[s].total++; });
            });
            const r = h['q' + q.id];
            if (r && r.attempts > r.correct) {
                q.choices.forEach(c => { c.stamp.forEach(s => { stampStats[s].wrong++; }); });
            }
        });
        html += '<div class="q-card" style="margin-top:16px;"><h3 style="font-size:16px;font-weight:800;margin-bottom:16px;">🔍 STAMP 함정 취약도</h3>';
        const stampNamesFull = { S: '주체(Subject)', T: '시점(Time)', A: '행위(Action)', M: '수식어(Modifier)', P: '결론(Predicate)' };
        Object.entries(stampStats).filter(([, s]) => s.total > 0).sort((a, b) => (b[1].wrong / b[1].total) - (a[1].wrong / a[1].total)).forEach(([s, v]) => {
            const pct = v.total > 0 ? Math.round(v.wrong / v.total * 100) : 0;
            html += `<div class="weak-bar">
      <div class="wb-label"><span class="stamp-tag ${s}">${s} ${stampNamesFull[s]}</span></div>
      <div class="wb-track"><div class="wb-fill" style="width:${pct}%;background:var(--stamp-${s.toLowerCase()});"></div></div>
      <div class="wb-val">${pct}%</div>
    </div>`;
        });
        html += '</div>';

        // Importance accuracy
        html += '<div class="q-card" style="margin-top:16px;"><h3 style="font-size:16px;font-weight:800;margin-bottom:16px;">⭐ 중요도별 정답률</h3>';
        ['S', 'A', 'B', 'C'].forEach(imp => {
            let total = 0, correct = 0;
            analysisPool.filter(q => q.importance === imp).forEach(q => {
                const r = h['q' + q.id];
                if (r) { total += r.attempts; correct += r.correct; }
            });
            if (total > 0) {
                const pct = Math.round(correct / total * 100);
                const color = pct >= 80 ? 'var(--correct)' : pct >= 60 ? 'var(--accent-amber)' : 'var(--incorrect)';
                html += `<div class="weak-bar">
        <div class="wb-label"><span class="q-badge imp-${imp}">${imp}급</span></div>
        <div class="wb-track"><div class="wb-fill" style="width:${pct}%;background:${color};"></div></div>
        <div class="wb-val" style="color:${color}">${pct}%</div>
      </div>`;
            }
        });
        html += '</div>';
        el.innerHTML = html;
    }

    function renderGuide() {
        const el = document.getElementById('guideContent');
        if (!el) return;

        const core = getFocusQuestions('national9');
        const coreCount = core.length;
        const playable = getPlayableQuestions();
        const sourcePool = [...playable, ...STATE.candidateQuestions];
        const candidateCount = STATE.candidateQuestions.length;
        const rawNationalCount = sourcePool.filter(q => q.exam === '국가직' && q.grade === 9).length;
        const rawExpandedCount = sourcePool.filter(q =>
            (q.exam === '국가직' && q.grade === 9) || q.exam === '지방직' || q.exam === '국가직7급' || q.exam === '국회직8급'
        ).length;
        const oxCount = core.reduce((s, q) => s + (q.choices?.length || 0), 0);
        const saCount = core.filter(q => q.importance === 'S' || q.importance === 'A').length;
        const saPct = coreCount ? Math.round((saCount / coreCount) * 100) : 0;
        const days = Math.max(1, calcDday());
        const cycleGoal = days >= 35 ? 3 : (days >= 18 ? 2 : 1.5);
        const dailyStem = Math.max(20, Math.ceil((coreCount * cycleGoal) / days));
        const dailyOx = Math.max(40, Math.ceil((oxCount * Math.min(cycleGoal, 1.4)) / days));

        const coverageGrade = coreCount >= 80 ? '충분(상)'
            : coreCount >= 60 ? '충분(중)'
                : coreCount >= 45 ? '준수(보강권장)'
                    : '보강 필요';

        const h = loadHistory();
        let red = 0;      // 반복 오답
        let amber = 0;    // 지연
        let yellow = 0;   // 단발 오답
        core.forEach(q => {
            const row = h['q' + q.id];
            if (!row || !row.attempts) return;
            const wrong = Math.max(0, row.attempts - row.correct);
            const acc = row.correct / row.attempts;
            const avgSec = row.avgResponseSec || 0;
            if (wrong >= 2 || acc < 0.6) red += 1;
            else if (avgSec >= SLOW_THRESHOLD_SEC) amber += 1;
            else if (wrong === 1) yellow += 1;
        });
        const dueReview = core.filter(q => calcReviewPriority(q, h) >= 1.35).length;

        el.innerHTML = `
        <div class="guide-grid">
          <div class="guide-card">
            <div class="guide-title">문제은행 충분성</div>
            <div class="guide-value">${coverageGrade}</div>
            <div class="guide-desc">핵심범위 ${coreCount}문항 · OX 변환 ${oxCount}문항 · S/A ${saPct}%</div>
            <div class="guide-desc">원자료 기준: 국가직9급 직기출 ${rawNationalCount}문항 · 확장기출 ${rawExpandedCount}문항</div>
            <div class="guide-desc">자동 추출 검증대기 ${candidateCount}문항 (정답키 입력 시 자동 활성화)</div>
            <div class="guide-desc">국가직 9급 실전 20문 기준으로 핵심 반복 인출용 데이터는 현재 ${coverageGrade} 수준입니다.</div>
          </div>
          <div class="guide-card">
            <div class="guide-title">시간 부족 대응(자동 산출)</div>
            <div class="guide-value">D-${days}</div>
            <div class="guide-desc">하루 목표: 통합 ${dailyStem}문 + OX ${dailyOx}문</div>
            <div class="guide-desc">권장 회전수: 시험 전 핵심범위 ${cycleGoal.toFixed(1)}회독</div>
          </div>
          <div class="guide-card">
            <div class="guide-title">불완전 반응 문항 처리</div>
            <div class="guide-desc">🔴 반복오답 ${red}문항 · 🟠 지연 ${amber}문항 · 🟡 단발오답 ${yellow}문항</div>
            <div class="guide-desc">즉시 복습 큐: ${dueReview}문항</div>
            <button class="btn btn-primary" data-action="start-review-queue" style="margin-top:10px;">취약 큐 바로 시작</button>
          </div>
        </div>
        <div class="guide-card" style="margin-top:12px;">
          <div class="guide-title">완벽하지 않은 문항 처리 규칙</div>
          <div class="guide-list">
            <div>1. <strong>반복오답(🔴)</strong> : 오늘 2회 + 내일 1회 + 3일 뒤 1회, 정답근거를 1문장으로 말할 때까지 반복</div>
            <div>2. <strong>지연문항(🟠)</strong> : 인출선행 ON 상태에서 5초 답변 연습 3회 후 다시 채점</div>
            <div>3. <strong>단발오답(🟡)</strong> : 당일 마감 전 1회 재풀이로 즉시 교정</div>
            <div>4. <strong>기억팁 자동모드</strong> : 기본 이미지형, 느리거나 반복오답이면 암송형, 스피드모드면 초압축형</div>
            <div>5. <strong>검증대기 문항 처리</strong> : <code>analysis/law_answer_keys.json</code>에 정답키 입력 → <code>python3 analysis/build_law_supplement.py</code> 재실행 시 자동 채점 문항으로 전환</div>
          </div>
        </div>
        <div class="guide-card" style="margin-top:12px;">
          <div class="guide-title">90점 압축 루틴</div>
          <div class="guide-list">
            <div>1. 오전: 통합 20문(정확도 우선, 인출선행 ON)</div>
            <div>2. 오후: 복습 큐 20문(오답·지연만)</div>
            <div>3. 밤: OX 40문(속도 우선, 스피드모드 ON)</div>
            <div>4. 종료 전: 오늘 틀린 문항 정답근거 1줄 암송 5분</div>
          </div>
        </div>`;
    }

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', e => {
        if (STATE.currentPage === 'study' && document.getElementById('studyArea').style.display !== 'none') {
            if (e.key >= '1' && e.key <= '4') {
                const q = STATE.studyQuestions[STATE.studyIndex];
                if (q) window.selectChoice(q.id, parseInt(e.key));
            }
            if (e.key === 'ArrowLeft') navStudy(-1);
            if (e.key === 'ArrowRight') navStudy(1);
        }
        if (STATE.currentPage === 'ox' && document.getElementById('oxArea').style.display !== 'none') {
            if (e.key === 'o' || e.key === 'O') window.selectOX(true);
            if (e.key === 'x' || e.key === 'X') window.selectOX(false);
            if (e.key === 'ArrowLeft') navOX(-1);
            if (e.key === 'ArrowRight') navOX(1);
        }
    });

    // ===== RUN =====
    document.addEventListener('DOMContentLoaded', init);
})();
