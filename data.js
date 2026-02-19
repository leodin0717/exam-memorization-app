// 행정법 암기전략 웹앱 - 기출문제 데이터베이스
// 시험일: 2026-04-05

const EXAM_DATE = '2026-04-05';

const STAMP_CARDS = [
    { id: 'S1', type: 'S', title: '주체 확인', rule: '누가 하는 행위인가? 행정청 vs 법원 vs 개인', tip: '🔍 선지의 첫 주어를 반드시 확인!', trap: '행정청→법원 바꿔치기 함정 다수' },
    { id: 'S2', type: 'T', title: '시점 확인', rule: '처분 시 vs 재결 시 vs 판결 시 vs 변론종결 시', tip: '⏰ 시점 명시 선지는 반드시 검증!', trap: '처분 시→판결 시 바꿔치기' },
    { id: 'S3', type: 'A', title: '행위 동사', rule: '~할 수 있다(재량) vs ~하여야 한다(기속)', tip: '🎬 동사가 핵심! 한 글자 차이로 정답 변경', trap: '재량↔기속 표현 교체 최빈출' },
    { id: 'S4', type: 'M', title: '수식어 확인', rule: '극단적 표현(반드시/항상/모든)은 99% 함정', tip: '🔎 범위 한정어가 함정!', trap: '원칙적으로→항상으로 바꿔 예외 무시' },
    { id: 'S5', type: 'P', title: '결론 확인', rule: '판례 결론 O/X와 선지 결론 정확히 일치하는가', tip: '🎯 최종 ~이다/~아니다 확인!', trap: '인정된다→인정되지 않는다 뒤집기' }
];

const TRAP_PATTERNS = [
    { id: 'T1', name: '재량↔기속 교체', desc: '할 수 있다↔하여야 한다 표현 교체', freq: '최빈출' },
    { id: 'T2', name: '예외의 예외', desc: '원칙→예외→예외의 예외 3단계 함정', freq: '고빈출' },
    { id: 'T3', name: '판례 결론 뒤집기', desc: '인정된다→인정되지 않는다 반전', freq: '최빈출' },
    { id: 'T4', name: '3법 혼동', desc: '행정기본법 vs 절차법 vs 소송법 조문 혼동', freq: '고빈출' },
    { id: 'T5', name: '무효↔취소 교체', desc: '무효(중대명백)와 취소(단순위법) 바꿔치기', freq: '고빈출' },
    { id: 'T6', name: '시점 바꿔치기', desc: '처분 시→판결 시 기준시점 교환', freq: '중빈출' },
    { id: 'T7', name: '주체 바꿔치기', desc: '행정청→법원, 법원→행정청 주체 교체', freq: '고빈출' }
];

// 단원/주제 분류 체계
const CHAPTERS = {
    'CH01': '행정법 일반원칙', 'CH02': '행정입법', 'CH03': '행정행위 총론',
    'CH04': '행정행위의 부관', 'CH05': '행정행위의 하자', 'CH06': '행정행위의 취소·철회',
    'CH07': '행정계획', 'CH08': '행정절차', 'CH09': '행정의 실효성 확보',
    'CH10': '행정소송 총론', 'CH11': '취소소송', 'CH12': '기타 항고소송',
    'CH13': '당사자소송·객관소송', 'CH14': '국가배상', 'CH15': '손실보상',
    'CH16': '공법상 계약', 'CH17': '정보공개', 'CH18': '사인의 공법행위',
    'CH19': '기속행위·재량행위', 'CH20': '제재처분·과징금', 'CH21': '인허가의제',
    'CH22': '공법상 부당이득', 'CH23': '행정심판', 'CH24': '행정조사'
};

// ========== 90점 달성 목표 문항 설계 ==========
// 9급 국가직 행정법: 20문항 x 5점 = 100점
// 90점 = 18/20 정답 필요 → 최대 2문항까지 오답 허용
// 목표별 필요 문항 수:
//   - S급(필수정복): ~40문항 → 시험에 12~14문항 직접 매칭
//   - A급(확실정리): ~40문항 → 시험에 4~6문항 매칭
//   - B급(기본이해): ~20문항 → 시험에 1~2문항 매칭
// 합계: 100문항 (64기존 + 36소방기출선별)
//
// 핵심 출제 빈도 분석 결과:
//   1. 행정행위+부관+하자 (CH03~06): 매년 3~4문항 → S급 집중
//   2. 취소소송+행정소송 (CH10~12): 매년 3~4문항 → S급 집중
//   3. 국가배상+손실보상 (CH14~15): 매년 2~3문항 → S급
//   4. 행정입법 (CH02): 매년 1~2문항 → S급
//   5. 행정절차 (CH08): 매년 1~2문항 → S급
//   6. 행정법일반원칙 (CH01): 매년 1문항 → S급
//   7. 실효성확보 (CH09): 매년 1~2문항 → A급
//   8. 정보공개/사인공법행위 (CH17~18): 1문항 격년 → A급
//   9. 행정심판 (CH23): 매년 1문항 → A급
//  10. 제재처분/과징금 (CH20): 격년 1문항 → B급

// 기출문제 데이터 (100문항: 9급국가직x3, 9급지방직x2, 7급국가직x1, 소방x4)
const QUESTIONS = [
    // ===== 2025 국가직 9급 =====
    {
        id: 1, year: 2025, exam: '국가직', grade: 9, chapter: 'CH01', topic: '행정법 일반원칙', importance: 'S',
        question: '행정법의 일반원칙에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '재량권 행사의 준칙인 행정규칙이 반복적으로 시행되어 행정관행이 성립한 경우, 행정청은 자기구속을 받게 된다.', ox: true, stamp: [] },
            { num: 2, text: '공적 견해표명이 있었는지 여부를 판단함에 있어서는 반드시 행정조직상의 형식적인 권한 분장에 구애될 것은 아니고, 담당자의 조직상의 지위와 임무, 당해 언동을 하게 된 구체적인 경위 등을 종합적으로 고려하여야 한다.', ox: true, stamp: ['M'] },
            { num: 3, text: '지방공무원 개방형직위 임용시험 시행공고에서 정한 선발예정인원 중 일부만을 최종합격자로 결정한 것은 공고된 면접시험 평정평가 결과에 따른 것으로서 헌법에 규정된 평등의 원칙에 위배되지 않는다.', ox: true, stamp: ['P'] },
            { num: 4, text: '과세관청이 납세의무자에게 부가가치세 면세사업자용 사업자등록증을 교부한 행위는 그가 영위하는 사업에 관하여 부가가치세를 과세하지 아니함을 시사하는 언동이나 공적인 견해를 표명한 것으로 볼 수 없다.', ox: true, stamp: ['P'] }
        ], answer: 4, keywords: ['자기구속', '공적견해표명', '평등원칙', '신뢰보호']
    },

    {
        id: 2, year: 2025, exam: '국가직', grade: 9, chapter: 'CH18', topic: '사인의 공법행위', importance: 'A',
        question: '사인의 공법행위에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '체육시설업 신고는 행정청의 수리처분 등 별단의 조치를 기다릴 필요 없이 그 접수시에 신고로서의 효력이 발생한다.', ox: true, stamp: ['A'] },
            { num: 2, text: '허가대상 건축물의 양수인이 형식적 요건을 갖추어 건축주 명의변경을 신고한 때에는 행정관청은 수리하여야 한다.', ox: true, stamp: ['A'] },
            { num: 3, text: '인허가의제 효과를 수반하는 건축신고는 수리를 요하는 신고에 해당한다.', ox: true, stamp: [] },
            { num: 4, text: '납골당설치 신고는 수리를 요하지 않는 자기완결적 신고에 해당한다.', ox: false, stamp: ['P'] }
        ], answer: 4, keywords: ['자기완결적신고', '수리를요하는신고', '인허가의제', '사인의공법행위']
    },

    {
        id: 3, year: 2025, exam: '국가직', grade: 9, chapter: 'CH06', topic: '행정행위의 취소', importance: 'S',
        question: '행정행위의 취소에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '행정청은 별도의 법적 근거가 없더라도 사정변경이 있는 경우 행정행위를 취소할 수 있다.', ox: true, stamp: ['A'] },
            { num: 2, text: '수익적 행정처분을 취소할 때에는 공익상 필요와 불이익을 비교·교량하여야 한다.', ox: true, stamp: [] },
            { num: 3, text: '수익적 행정행위의 하자가 당사자의 사위의 방법에 기인한 것이라면 신뢰이익을 원조하지 않아도 된다.', ox: true, stamp: ['P'] },
            { num: 4, text: '처분청은 영업허가취소처분을 한 후 그 처분을 다시 취소함으로써 본래의 상태로 회복시킬 수 있다.', ox: true, stamp: [] }
        ], answer: 1, keywords: ['직권취소', '사정변경', '신뢰보호', '취소의취소']
    },

    {
        id: 4, year: 2025, exam: '국가직', grade: 9, chapter: 'CH07', topic: '행정계획', importance: 'A',
        question: '행정계획에 대한 설명으로 옳은 것만을 모두 고르면?', type: 'combination',
        choices: [
            { num: 1, text: 'ㄱ, ㄴ', ox: false, stamp: [] },
            { num: 2, text: 'ㄱ, ㄷ', ox: false, stamp: [] },
            { num: 3, text: 'ㄴ, ㄷ', ox: false, stamp: [] },
            { num: 4, text: 'ㄱ, ㄴ, ㄷ', ox: true, stamp: [] }
        ], answer: 4, keywords: ['도시기본계획', '환지계획', '비구속적행정계획', '헌법소원'],
        subItems: ['ㄱ. 도시기본계획은 일반 국민에 대하여 직접적인 구속력을 가지는 것은 아니다.', 'ㄴ. 환지계획은 항고소송의 대상이 되는 처분에 해당한다.', 'ㄷ. 비구속적 행정계획안이라도 국민의 기본권에 직접적으로 영향을 끼치면 헌법소원의 대상이 될 수 있다.']
    },

    {
        id: 5, year: 2025, exam: '국가직', grade: 9, chapter: 'CH04', topic: '행정행위의 부관', importance: 'S',
        question: '행정행위의 부관에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '어업면허처분에서 면허의 유효기간을 1년으로 정하는 경우 이는 부관이며 독립하여 행정소송의 대상이 될 수 없다.', ox: false, stamp: ['P'] },
            { num: 2, text: '도로점용허가의 점용기간은 본질적 요소에 해당하므로 부관인 점용기간의 위법사유가 있다면 처분 전부가 위법하게 된다.', ox: true, stamp: [] },
            { num: 3, text: '행정처분과 실제적 관련성이 없어 부관으로 붙일 수 없는 부담은 사법상 계약의 형식으로도 부과할 수 없다.', ox: true, stamp: [] },
            { num: 4, text: '사도개설허가에서 정해진 공사기간 내에 준공검사를 받지 못하면 사도개설허가는 당연히 실효된다.', ox: true, stamp: ['P'] }
        ], answer: 1, keywords: ['부관', '유효기간', '점용기간', '부담', '실효']
    },

    {
        id: 6, year: 2025, exam: '국가직', grade: 9, chapter: 'CH03', topic: '행정행위', importance: 'A',
        question: '행정행위에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '사실상 영업이 양도·양수되었지만 승계신고 전이면 양수인의 영업 중 위반행위 책임은 양도인에게 귀속된다.', ox: true, stamp: ['S'] },
            { num: 2, text: '산림청장의 국유임야 대부는 사법상 계약이지만, 대부료부과 조치는 행정처분이다.', ox: false, stamp: ['P'] },
            { num: 3, text: '인가처분에 하자가 없더라도 기본행위에 하자가 있다면 인가처분의 취소를 구할 수 있다.', ox: false, stamp: ['P'] },
            { num: 4, text: '행정청이 논리적으로 당연히 수반되어야 하는 의사표시를 명시적으로 하지 않으면 묵시적으로도 포함되어 있다고 볼 수 없다.', ox: false, stamp: ['P'] }
        ], answer: 1, keywords: ['영업양도', '국유임야대부', '인가', '묵시적의사표시']
    },

    {
        id: 7, year: 2025, exam: '국가직', grade: 9, chapter: 'CH16', topic: '공법상 계약', importance: 'B',
        question: '공법상 계약에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '한국형헬기 개발협약의 법률관계는 공법관계에 해당한다.', ox: true, stamp: [] },
            { num: 2, text: '입찰보증금의 국고귀속조치는 공권력 행사로서 행정소송의 대상이 된다.', ox: false, stamp: ['P'] },
            { num: 3, text: '국가연구개발사업 협약의 해지 통보는 대등 당사자의 지위에서 공법상 계약을 종료시키는 의사표시이다.', ox: false, stamp: [] },
            { num: 4, text: '국립의료원 부설주차장 위탁관리용역계약은 사법상 계약이다.', ox: false, stamp: [] }
        ], answer: 1, keywords: ['공법상계약', '입찰보증금', '연구개발협약']
    },

    {
        id: 8, year: 2025, exam: '국가직', grade: 9, chapter: 'CH19', topic: '기속행위와 재량행위', importance: 'S',
        question: '기속행위와 재량행위에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '마을버스 노선 중복 허용 정도에 대한 판단은 행정청의 재량에 속한다.', ox: true, stamp: [] },
            { num: 2, text: '대기오염물질 총량관리사업장 설치의 허가는 기속행위에 해당한다.', ox: false, stamp: ['A'] },
            { num: 3, text: '국유재산 무단점유에 대한 변상금 징수는 기속행위이다.', ox: true, stamp: ['A'] },
            { num: 4, text: '개발행위허가는 불확정개념으로 규정되어 재량판단의 영역에 속한다.', ox: true, stamp: [] }
        ], answer: 2, keywords: ['재량행위', '기속행위', '변상금', '개발행위허가']
    },

    {
        id: 9, year: 2025, exam: '국가직', grade: 9, chapter: 'CH08', topic: '행정절차', importance: 'S',
        question: '「행정절차법」상 행정절차에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '행정청은 입법할 때까지 새로운 사정이 발견되면 공청회를 다시 개최하여야 한다.', ox: false, stamp: ['A'] },
            { num: 2, text: '귀화는 행정절차를 거치기 곤란한 사항이 아니므로 이유제시 규정이 적용된다.', ox: false, stamp: ['P'] },
            { num: 3, text: '국가에 대해 행정처분을 할 때에도 행정절차법이 적용된다.', ox: false, stamp: ['S'] },
            { num: 4, text: '대표자가 있는 경우에도 당사자들은 직접 행정절차에 관한 행위를 할 수 있다.', ox: true, stamp: [] }
        ], answer: 4, keywords: ['공청회', '귀화', '이유제시', '대표자']
    },

    {
        id: 10, year: 2025, exam: '국가직', grade: 9, chapter: 'CH17', topic: '정보공개', importance: 'A',
        question: '정보공개에 대한 설명으로 옳은 것만을 모두 고르면?', type: 'combination',
        choices: [
            { num: 1, text: 'ㄱ', ox: true, stamp: [] },
            { num: 2, text: 'ㄱ, ㄷ', ox: false, stamp: [] },
            { num: 3, text: 'ㄴ, ㄷ', ox: false, stamp: [] },
            { num: 4, text: 'ㄱ, ㄴ, ㄷ', ox: false, stamp: [] }
        ], answer: 1, keywords: ['정보공개심의회', '비공개사유', '징벌위원회회의록']
    },

    {
        id: 11, year: 2025, exam: '국가직', grade: 9, chapter: 'CH20', topic: '제재처분', importance: 'S',
        question: '제재처분에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '과징금부과처분이 한도액을 초과하여 위법할 경우 법원은 전부를 취소할 수밖에 없다.', ox: true, stamp: ['P'] },
            { num: 2, text: '제재처분 제척기간의 적용 대상은 인허가의 정지·취소·철회 등에 한정된다.', ox: true, stamp: ['M'] },
            { num: 3, text: '여러 처분사유 중 일부가 인정되지 않으면 나머지만으로 정당해도 취소할 수 있다.', ox: false, stamp: ['P'] },
            { num: 4, text: '효력기간이 정해진 제재적 처분의 효력 발생 후에도 시기와 종기를 다시 정할 수 있다.', ox: true, stamp: ['T'] }
        ], answer: 3, keywords: ['과징금', '제척기간', '처분사유', '효력기간']
    },

    {
        id: 12, year: 2025, exam: '국가직', grade: 9, chapter: 'CH22', topic: '공법상 부당이득', importance: 'B',
        question: '공법상 부당이득에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '개발부담금 부과처분이 취소된 후 과오납금 반환은 민사 관계에 불과하다.', ox: true, stamp: [] },
            { num: 2, text: '조세환급금은 부당이득에 해당하고, 환급가산금은 법정이자의 성질을 가진다.', ox: true, stamp: [] },
            { num: 3, text: '당연무효인 변상금부과처분에 의한 오납금 반환청구권은 납부시에 발생한다.', ox: true, stamp: ['T'] },
            { num: 4, text: '국가는 무단점유자에 대해 변상금 부과·징수 외에 민사상 부당이득반환청구도 가능하다.', ox: false, stamp: ['P'] }
        ], answer: 4, keywords: ['과오납금', '조세환급금', '변상금', '부당이득반환']
    },

    {
        id: 13, year: 2025, exam: '국가직', grade: 9, chapter: 'CH09', topic: '행정의 실효성 확보', importance: 'S',
        question: '행정의 실효성 확보수단에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '대집행비용 징수금은 사무비의 소속에 따라 국고 또는 지방자치단체의 수입으로 한다.', ox: true, stamp: [] },
            { num: 2, text: '외국인의 출입국에 관하여는 행정기본법상 행정상 강제 규정이 적용된다.', ox: false, stamp: ['S'] },
            { num: 3, text: '장기미등기자가 기간 경과 후 등기신청의무를 이행하여도 이행강제금을 부과할 수 없다.', ox: false, stamp: ['P'] },
            { num: 4, text: '지방자치단체는 도로법 양벌규정에 따라 처벌대상이 되는 법인에 해당한다.', ox: true, stamp: ['S'] }
        ], answer: 2, keywords: ['대집행', '행정상강제', '이행강제금', '양벌규정']
    },

    {
        id: 14, year: 2025, exam: '국가직', grade: 9, chapter: 'CH11', topic: '제소기간', importance: 'S',
        question: '행정소송의 제소기간과 행정심판의 청구기간에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '부작위위법확인소송은 전심절차를 거친 경우에도 제소기간이 적용되지 않는다.', ox: false, stamp: ['P'] },
            { num: 2, text: '당사자소송에 법령에 제소기간이 정하여져 있는 때에는 불변기간으로 한다.', ox: true, stamp: [] },
            { num: 3, text: '행정청이 법정 심판청구기간보다 긴 기간으로 잘못 알린 경우의 규정은 행정소송에 당연히 적용되지 않는다.', ox: true, stamp: ['P'] },
            { num: 4, text: '부적법한 행정심판청구에 대한 재결 후 90일 이내 취소소송을 제기해도 제소기간을 준수한 것으로 되지 않는다.', ox: true, stamp: ['T'] }
        ], answer: 1, keywords: ['부작위위법확인', '제소기간', '불변기간', '전심절차']
    },

    {
        id: 15, year: 2025, exam: '국가직', grade: 9, chapter: 'CH11', topic: '피고적격', importance: 'S',
        question: '항고소송의 피고적격에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '조례에 대한 무효확인소송에서 피고적격은 지방의회이다.', ox: false, stamp: ['S'] },
            { num: 2, text: '중앙노동위원회의 처분에 대한 소는 중앙노동위원회가 피고가 된다.', ox: false, stamp: ['S'] },
            { num: 3, text: '대통령이 처분청인 경우에는 대통령이 피고가 된다.', ox: false, stamp: ['S'] },
            { num: 4, text: '대리기관이 대리관계를 표시하고 처분한 때에는 피대리 행정청이 피고가 된다.', ox: true, stamp: ['S'] }
        ], answer: 4, keywords: ['피고적격', '대리기관', '합의제행정기관', '조례']
    },

    {
        id: 16, year: 2025, exam: '국가직', grade: 9, chapter: 'CH15', topic: '토지수용·보상', importance: 'A',
        question: '토지보상법의 내용으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '사업인정고시 후 1년 이내 재결신청 미시 사업인정은 효력을 상실한다.', ox: true, stamp: ['T'] },
            { num: 2, text: '토지수용위원회는 직권 또는 신청에 의하여 경정재결을 할 수 있다.', ox: true, stamp: [] },
            { num: 3, text: '보상액의 산정은 협의 시 협의 성립 당시의 가격, 재결 시 재결 당시의 가격을 기준으로 한다.', ox: true, stamp: ['T'] },
            { num: 4, text: '중앙토지수용위원회는 이의신청 시 재결을 취소할 수 있고 보상액을 변경할 수 없다.', ox: false, stamp: ['A', 'P'] }
        ], answer: 4, keywords: ['사업인정', '경정재결', '보상액산정', '이의신청']
    },

    {
        id: 17, year: 2025, exam: '국가직', grade: 9, chapter: 'CH14', topic: '영조물 하자 배상', importance: 'S',
        question: '영조물의 설치·관리의 하자로 인한 손해배상책임에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '영조물 책임은 무과실책임이고 민법상 공작물 점유자 책임과 달리 면책사유도 규정되어 있지 않다.', ox: true, stamp: [] },
            { num: 2, text: '공공의 영조물에는 사실상 관리하고 있는 경우도 포함된다.', ox: true, stamp: ['M'] },
            { num: 3, text: '영조물 하자에는 수인한도를 넘는 피해를 입히는 경우까지 포함된다.', ox: true, stamp: [] },
            { num: 4, text: '사실상 도로로 사용되고 있었다면 공용개시가 없어도 영조물이라 할 수 있다.', ox: true, stamp: [] }
        ], answer: 4, keywords: ['영조물', '무과실책임', '수인한도', '공용개시']
    },

    {
        id: 18, year: 2025, exam: '국가직', grade: 9, chapter: 'CH03', topic: '판례', importance: 'A',
        question: '판례의 입장으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '증액경정처분이 있는 경우 당초처분의 절차적 하자는 증액경정처분에 승계되지 아니한다.', ox: true, stamp: ['P'] },
            { num: 2, text: '퇴직연금 환수결정에 앞서 의견진술 기회를 주지 않으면 위법하다.', ox: true, stamp: [] },
            { num: 3, text: '거부처분 후 새로운 신청에 대한 거절은 새로운 거부처분이다.', ox: true, stamp: [] },
            { num: 4, text: '고지의무 불이행으로 행정심판 제기기간이 연장될 수 있을 뿐 처분이 위법한 것은 아니다.', ox: true, stamp: ['P'] }
        ], answer: 2, keywords: ['증액경정처분', '퇴직연금환수', '거부처분', '고지의무']
    },

    {
        id: 19, year: 2025, exam: '국가직', grade: 9, chapter: 'CH02', topic: '행정입법', importance: 'S',
        question: '행정입법에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '행정규칙의 내용이 상위법령에 반하면 당연무효이고 행정내부적 효력도 인정될 수 없다.', ox: true, stamp: ['P'] },
            { num: 2, text: '내부지침 위배만으로 처분이 위법하게 되는 것은 아니다.', ox: true, stamp: [] },
            { num: 3, text: '전결규정에 위반한 처분은 무효의 처분이다.', ox: false, stamp: ['P'] },
            { num: 4, text: '대법원판결로 명령·규칙이 위반된다고 확정되면 행정안전부장관에게 통보하여야 한다.', ox: true, stamp: [] }
        ], answer: 3, keywords: ['행정규칙', '전결규정', '법규명령', '대법원통보']
    },

    {
        id: 20, year: 2025, exam: '국가직', grade: 9, chapter: 'CH21', topic: '인허가의제', importance: 'A',
        question: '인허가의제에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '인허가의제의 효과는 주된 인허가의 해당 법률에 규정된 관련 인허가에 한정된다.', ox: true, stamp: ['M'] },
            { num: 2, text: '건축허가신청이 개발행위허가기준에 부합하지 않으면 거부할 수 있다.', ox: true, stamp: [] },
            { num: 3, text: '의제된 인허가의 위법을 다투려면 주된 인허가의 취소를 구하여야 한다.', ox: true, stamp: [] },
            { num: 4, text: '사업시행자는 반드시 관련 인허가의제 처리를 신청할 의무가 있는 것은 아니다.', ox: true, stamp: [] }
        ], answer: 1, keywords: ['인허가의제', '건축허가', '개발행위허가', '주된인허가']
    },

    // ===== 2024 국가직 9급 =====
    {
        id: 21, year: 2024, exam: '국가직', grade: 9, chapter: 'CH01', topic: '기간의 계산', importance: 'A',
        question: '「행정기본법」상 기간의 계산에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '행정에 관한 기간의 계산은 행정기본법 또는 다른 법령등에 특별한 규정이 있는 경우를 제외하고 민법을 준용한다.', ox: true, stamp: [] },
            { num: 2, text: '법령 시행 기간의 말일이 토요일 또는 공휴일인 때에는 그 말일로 기간이 만료한다.', ox: true, stamp: ['T'] },
            { num: 3, text: '법령 시행 기간 계산 시 공포한 날을 첫날에 산입한다.', ox: true, stamp: ['T'] },
            { num: 4, text: '권익 제한 등의 기간 계산 시 기간의 첫날을 산입한다. 다만 국민에게 불리한 경우에는 그러하지 아니하다.', ox: true, stamp: [] }
        ], answer: 2, keywords: ['기간계산', '첫날산입', '말일', '민법준용']
    },

    {
        id: 22, year: 2024, exam: '국가직', grade: 9, chapter: 'CH08', topic: '행정절차', importance: 'S',
        question: '행정절차에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '청문은 당사자가 공개를 신청하거나 주재자가 필요하다고 인정하는 경우 공개할 수 있다.', ox: true, stamp: [] },
            { num: 2, text: '인·허가 거부 시 근거를 알 수 있을 정도로 상당한 이유를 제시하면 위법하지 않다.', ox: true, stamp: [] },
            { num: 3, text: '공무원 인사관계 법령에 따른 처분에는 행정절차법 적용이 배제된다.', ox: true, stamp: ['S'] },
            { num: 4, text: '과세처분이 절차 위법으로 취소된 후 위법사유를 보완하여 다시 과세처분을 할 수 있다.', ox: true, stamp: [] }
        ], answer: 3, keywords: ['청문', '이유제시', '공무원인사', '과세처분']
    },

    {
        id: 23, year: 2024, exam: '국가직', grade: 9, chapter: 'CH14', topic: '국가배상', importance: 'S',
        question: '국가배상에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '공무원의 직무에는 사경제주체로서 하는 작용도 포함된다.', ox: false, stamp: ['S'] },
            { num: 2, text: '헌법재판소 재판관이 청구기간을 오인하여 각하결정을 한 경우 국가배상책임을 인정할 수 있다.', ox: true, stamp: [] },
            { num: 3, text: '군 복무 중 사망한 군인 유족이 손해배상금을 받은 경우 사망보상금에서 공제할 수 없다.', ox: false, stamp: ['P'] },
            { num: 4, text: '외국인에게는 상호보증 없이도 국가배상법이 적용된다.', ox: false, stamp: ['P'] }
        ], answer: 2, keywords: ['국가배상', '상호보증', '군인연금', '헌법재판소']
    },

    {
        id: 24, year: 2024, exam: '국가직', grade: 9, chapter: 'CH17', topic: '정보공개', importance: 'A',
        question: '정보공개에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '학교폭력대책자치위원회 회의록은 비공개사유에 해당한다.', ox: true, stamp: [] },
            { num: 2, text: '사본 교부 방법으로 청구한 경우 공공기관은 공개방법을 선택할 재량권이 없다.', ox: true, stamp: ['A'] },
            { num: 3, text: '대학수학능력시험 원데이터는 연구목적이라도 비공개대상정보에 해당한다.', ox: true, stamp: [] },
            { num: 4, text: '공개의 공익성은 비공개 이익과 비교·교량하여 판단하여야 한다.', ox: true, stamp: [] }
        ], answer: 3, keywords: ['학교폭력', '정보공개', '수능원데이터', '공익성']
    },

    {
        id: 25, year: 2024, exam: '국가직', grade: 9, chapter: 'CH06', topic: '직권취소·철회', importance: 'S',
        question: '행정행위의 직권취소 및 철회에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '쟁송이 진행 중에는 행정청은 스스로 대상 처분을 취소할 수 없다.', ox: false, stamp: ['P'] },
            { num: 2, text: '사정변경으로 적법한 처분을 철회할 수 있다.', ox: true, stamp: [] },
            { num: 3, text: '불가쟁력이 발생하여도 실권의 법리에 해당하지 않으면 직권취소 가능하다.', ox: true, stamp: ['T'] },
            { num: 4, text: '위법 또는 부당한 처분은 소급하여 취소할 수 있다.', ox: true, stamp: ['T'] }
        ], answer: 1, keywords: ['직권취소', '철회', '쟁송중취소', '불가쟁력']
    },

    {
        id: 26, year: 2024, exam: '국가직', grade: 9, chapter: 'CH20', topic: '과징금', importance: 'A',
        question: '과징금에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '부당지원행위에 대한 과징금은 행정상 제재금으로서 형벌에 해당하지 아니한다.', ox: true, stamp: [] },
            { num: 2, text: '과징금 분할 납부는 납부기한 7일 전까지 신청해야 한다.', ox: true, stamp: ['T'] },
            { num: 3, text: '여러 위반행위를 인지하면 일괄하여 하나의 과징금 부과처분을 하는 것이 원칙이다.', ox: true, stamp: [] },
            { num: 4, text: '과징금의 근거 법률에는 부과·징수 주체, 부과 사유, 상한액 등을 명확히 규정하여야 한다.', ox: true, stamp: [] }
        ], answer: 2, keywords: ['과징금', '분할납부', '일괄부과', '법률유보']
    },

    {
        id: 27, year: 2024, exam: '국가직', grade: 9, chapter: 'CH09', topic: '행정대집행', importance: 'S',
        question: '행정대집행 사례에 대한 설명으로 옳은 것만을 모두 고르면?', type: 'combination',
        choices: [
            { num: 1, text: 'ㄱ, ㄴ', ox: false, stamp: [] },
            { num: 2, text: 'ㄴ, ㄹ', ox: true, stamp: [] },
            { num: 3, text: 'ㄱ, ㄷ, ㄹ', ox: false, stamp: [] },
            { num: 4, text: 'ㄴ, ㄷ, ㄹ', ox: false, stamp: [] }
        ], answer: 2, keywords: ['행정대집행', '토지인도', '건물철거', '퇴거']
    },

    // ===== 2024 지방직 9급 (일부) =====
    {
        id: 28, year: 2024, exam: '지방직', grade: 9, chapter: 'CH01', topic: '신뢰보호원칙', importance: 'S',
        question: '신뢰보호의 원칙에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '확약 후 사실적·법률적 상태가 변경되면 확약은 별다른 의사표시 없이 효력을 상실한다.', ox: true, stamp: [] },
            { num: 2, text: '공적 견해표명 판단은 권한 분장에 따라 엄격하게 판단하여야 하므로 담당자의 직위와 임무는 고려 대상이 아니다.', ox: false, stamp: ['P'] },
            { num: 3, text: '처분청이 이전 처분에 대해 공적 견해를 표명한 경우 신뢰보호원칙의 적용대상이 될 수 있다.', ox: true, stamp: [] },
            { num: 4, text: '행정기본법은 공익 또는 제3자의 이익을 현저히 해칠 우려가 있는 경우를 제외하고 신뢰를 보호하여야 한다고 규정한다.', ox: true, stamp: ['M'] }
        ], answer: 2, keywords: ['신뢰보호', '확약', '공적견해표명', '행정기본법']
    },

    {
        id: 29, year: 2024, exam: '지방직', grade: 9, chapter: 'CH12', topic: '무효등확인소송', importance: 'S',
        question: '무효등 확인소송에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '무효확인판결에는 취소판결의 기속력 규정이 준용되지 않는다.', ox: false, stamp: ['P'] },
            { num: 2, text: '제기 당시 원고적격을 갖추면 상고심 중 상실해도 소는 적법하다.', ox: false, stamp: [] },
            { num: 3, text: '무효인 처분에 대해서는 집행정지가 인정되지 아니한다.', ox: false, stamp: ['P'] },
            { num: 4, text: '무효확인소송에서 원고에게 무효 사유의 주장·입증 책임이 있다.', ox: true, stamp: [] }
        ], answer: 4, keywords: ['무효확인소송', '기속력', '집행정지', '입증책임']
    },

    {
        id: 30, year: 2024, exam: '지방직', grade: 9, chapter: 'CH11', topic: '피고적격', importance: 'S',
        question: '행정소송의 피고에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '처분 후 권한이 승계된 때에는 처분을 한 행정청을 피고로 하여야 한다.', ox: false, stamp: ['S', 'P'] },
            { num: 2, text: '위임이 있으면 수임청이 피고가 된다.', ox: true, stamp: ['S'] },
            { num: 3, text: '대리관계를 밝히지 않고 자신의 이름으로 처분하면 그 행정청이 피고가 된다.', ox: true, stamp: ['S'] },
            { num: 4, text: '내부위임을 받은 하급행정청이 권한 없이 처분하면 하급행정청이 피고이다.', ox: true, stamp: ['S'] }
        ], answer: 1, keywords: ['피고적격', '권한승계', '위임', '내부위임', '대리']
    },

    // 추가 문항들 (2023 국가직, 2024 지방직, 2025 지방직 핵심)
    {
        id: 31, year: 2023, exam: '국가직', grade: 9, chapter: 'CH08', topic: '처분의 신청', importance: 'A',
        question: '행정절차법령상 처분의 신청에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '행정청은 신청인의 편의를 위하여 다른 행정청에 신청을 접수하게 할 수 있다.', ox: true, stamp: [] },
            { num: 2, text: '행정청은 신청에 흠이 있는 경우 접수를 거부하여야 한다.', ox: false, stamp: ['A'] },
            { num: 3, text: '처리기간이 즉시인 경우 접수증을 주지 아니할 수 있다.', ox: true, stamp: [] },
            { num: 4, text: '다수의 행정청이 관여하는 처분의 신청을 접수한 경우 협조를 통하여 지연되지 않도록 하여야 한다.', ox: true, stamp: [] }
        ], answer: 2, keywords: ['처분의신청', '접수', '흠보완', '처리기간']
    },

    {
        id: 32, year: 2023, exam: '국가직', grade: 9, chapter: 'CH06', topic: '취소와 철회', importance: 'S',
        question: '행정행위의 취소와 철회에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '행정기본법은 직권취소나 철회의 일반적 근거규정을 두고 있다.', ox: true, stamp: [] },
            { num: 2, text: '철회 사유는 행정행위 성립 이전에 발생한 것이다.', ox: false, stamp: ['T'] },
            { num: 3, text: '수익적 처분이 부정한 방법으로 행하여졌다면 신뢰보호가 필요 없다.', ox: true, stamp: [] },
            { num: 4, text: '수익적 행정처분의 직권취소는 공익상 필요가 불이익을 정당화할 만큼 강한 경우에만 가능하다.', ox: true, stamp: [] }
        ], answer: 2, keywords: ['취소', '철회', '행정기본법', '신뢰보호']
    },

    {
        id: 33, year: 2023, exam: '국가직', grade: 9, chapter: 'CH04', topic: '부관', importance: 'S',
        question: '행정행위의 부관에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '수익적 행정처분에는 법령에 특별한 근거규정이 있는 경우에만 부담을 붙일 수 있다.', ox: false, stamp: ['M'] },
            { num: 2, text: '기선선망어업 허가에서 부속선 사용금지 부관은 본질적 효력을 해하여 위법하다.', ox: true, stamp: [] },
            { num: 3, text: '부관은 면허 발급 이후에도 법률 규정, 변경 유보, 동의가 있으면 허용된다.', ox: true, stamp: [] },
            { num: 4, text: '기부채납 부관이 무효나 취소되지 않은 이상 착오를 이유로 기부채납계약을 취소할 수 없다.', ox: true, stamp: [] }
        ], answer: 1, keywords: ['부관', '부담', '기부채납', '면허후부관']
    },

    {
        id: 34, year: 2024, exam: '지방직', grade: 9, chapter: 'CH14', topic: '국가배상', importance: 'S',
        question: '위법한 직무집행행위로 인한 손해배상책임에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '공무원이라 함은 공무를 위탁받아 실질적으로 공무에 종사하는 자를 가리키며, 일시적인 활동도 포함된다.', ox: false, stamp: ['S', 'P'] },
            { num: 2, text: '공무원의 직무에는 행정지도와 같은 비권력적 공행정작용도 포함된다.', ox: true, stamp: [] },
            { num: 3, text: '취소되었다 하여 곧 공무원의 불법행위를 구성한다고 단정할 수 없다.', ox: true, stamp: ['P'] },
            { num: 4, text: '과잉금지원칙을 위반한 국가작용은 법령을 위반한 가해행위가 된다.', ox: true, stamp: [] }
        ], answer: 1, keywords: ['국가배상', '공무원', '직무범위', '행정지도']
    },

    {
        id: 35, year: 2024, exam: '지방직', grade: 9, chapter: 'CH09', topic: '행정대집행', importance: 'S',
        question: '행정대집행에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '대집행이 가능한 경우에는 민사소송으로 의무이행을 구할 수 없다.', ox: true, stamp: [] },
            { num: 2, text: '토지 협의취득 시 부담한 의무는 행정대집행의 대상이 되지 않는다.', ox: true, stamp: [] },
            { num: 3, text: '대집행비용 징수금은 사무비의 소속에 따라 국고 또는 지방자치단체의 수입으로 한다.', ox: true, stamp: [] },
            { num: 4, text: '자기완결적 신고의 수리 거부 후 철거명령을 하면 대집행계고처분도 당연무효가 된다.', ox: false, stamp: ['P'] }
        ], answer: 4, keywords: ['행정대집행', '협의취득', '대집행비용', '자기완결적신고']
    },

    {
        id: 36, year: 2024, exam: '지방직', grade: 9, chapter: 'CH05', topic: '행정행위의 하자', importance: 'S',
        question: '행정행위의 하자에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '수익적 행정처분의 취소 제한 법리는 쟁송취소의 경우에는 적용되지 않는다.', ox: true, stamp: [] },
            { num: 2, text: '학교환경위생정화위원회 심의절차 누락은 취소사유가 된다.', ox: true, stamp: [] },
            { num: 3, text: '청문서 도달기간 위반 후 당사자가 청문에 출석하여 방어하여도 하자가 치유되지 않는다.', ox: true, stamp: ['P'] },
            { num: 4, text: '토지등급결정 내용을 알았다 하더라도 개별통지의 하자가 치유되지는 않는다.', ox: true, stamp: [] }
        ], answer: 3, keywords: ['하자', '청문서도달기간', '치유', '심의절차누락']
    },

    {
        id: 37, year: 2025, exam: '지방직', grade: 9, chapter: 'CH11', topic: '가구제', importance: 'S',
        question: '행정쟁송의 가구제에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '집행정지 결정 또는 기각에 대하여는 즉시항고할 수 있다.', ox: true, stamp: [] },
            { num: 2, text: '집행정지 신청은 행정소송법상으로만 가능하고 민사소송법상 가처분으로는 불가하다.', ox: true, stamp: [] },
            { num: 3, text: '임시처분은 집행정지로 목적을 달성할 수 없는 경우 결정할 수 있다.', ox: true, stamp: [] },
            { num: 4, text: '집행정지결정 후 본안소송이 취하되면 집행정지결정의 효력이 당연히 소멸된다.', ox: false, stamp: ['P'] }
        ], answer: 4, keywords: ['집행정지', '즉시항고', '임시처분', '본안소송취하']
    },

    {
        id: 38, year: 2025, exam: '지방직', grade: 9, chapter: 'CH08', topic: '이유제시', importance: 'S',
        question: '처분의 이유제시에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '신청 내용을 모두 인정하는 처분이면 요청하여도 이유를 제시하지 않아도 된다.', ox: true, stamp: ['A'] },
            { num: 2, text: '단순·반복적 처분이면 요청하여도 이유를 제시하지 않아도 된다.', ox: false, stamp: ['P'] },
            { num: 3, text: '긴급히 처분을 할 필요가 있으면 요청하여도 이유를 제시하지 않아도 된다.', ox: false, stamp: ['P'] },
            { num: 4, text: '당사자가 근거와 이유를 충분히 알 수 있어도 처분서에 명시되지 않으면 위법하다.', ox: false, stamp: ['P'] }
        ], answer: 1, keywords: ['이유제시', '단순반복적처분', '긴급처분', '처분서']
    },

    {
        id: 39, year: 2025, exam: '지방직', grade: 9, chapter: 'CH05', topic: '선결문제', importance: 'A',
        question: '선결문제에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '위법한 대집행이 완료되면 무효확인을 구할 소의 이익은 없지만 손해배상청구는 가능하다.', ox: true, stamp: [] },
            { num: 2, text: '취소사유에 불과한 하자가 있는 처분은 취소되지 않는 한 효력을 부정할 수 없다.', ox: true, stamp: [] },
            { num: 3, text: '당연무효한 과세에 대하여는 체납범이 성립하지 않는다.', ox: true, stamp: [] },
            { num: 4, text: '연령미달 결격자가 타인 이름으로 받은 운전면허는 당연무효이므로 무면허운전에 해당한다.', ox: true, stamp: [] }
        ], answer: 1, keywords: ['선결문제', '대집행', '공정력', '당연무효']
    },

    {
        id: 40, year: 2025, exam: '지방직', grade: 9, chapter: 'CH11', topic: '기속력', importance: 'S',
        question: '취소판결의 기속력에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '청구를 기각하는 판결에도 기속력이 인정된다.', ox: false, stamp: ['P'] },
            { num: 2, text: '기속력은 판결의 주문에 대해서만 인정된다.', ox: false, stamp: ['M'] },
            { num: 3, text: '거부처분 취소판결이 절차 위법에 의한 것이면 위법사유를 보완하여 다시 거부할 수 있다.', ox: true, stamp: [] },
            { num: 4, text: '기속력은 민사소송법상 준용되는 규정이다.', ox: false, stamp: ['P'] }
        ], answer: 3, keywords: ['기속력', '기각판결', '주문', '거부처분', '절차위법']
    },

    // ===== 2025 국가직 7급 (9급 출제범위 해당 문항 선별) =====
    {
        id: 41, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH01', topic: '신뢰보호원칙', importance: 'S',
        question: '신뢰보호원칙에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '행정청이 단순히 착오로 어떠한 처분을 계속하였다가 추후 오류를 발견하여 합리적인 방법으로 변경하는 것은 신뢰보호원칙에 위배되지 않는다.', ox: true, stamp: ['P'] },
            { num: 2, text: '행정청이 공적 견해를 표명할 당시의 사정이 변경된 경우에는, 특별한 사정이 없는 한 행정청이 그 견해 표명에 반하는 처분을 하더라도 신뢰보호원칙에 위반된다고 할 수 없다.', ox: true, stamp: ['P'] },
            { num: 3, text: '입법 예고를 통해 법령안의 내용을 국민에게 예고하였다면, 그것이 법령으로 확정되지 아니하였더라도 신뢰보호의 대상이 될 수 있다.', ox: false, stamp: ['P'] },
            { num: 4, text: '행정청의 공적 견해표명이 있었는지의 여부를 판단하는 데 있어서는 담당자의 조직상의 지위와 임무, 당해 언동을 하게 된 구체적인 경위 및 그에 대한 상대방의 신뢰가능성에 비추어 실질에 의하여 판단하여야 한다.', ox: true, stamp: ['M'] }
        ], answer: 3, keywords: ['신뢰보호', '입법예고', '공적견해표명', '사정변경']
    },

    {
        id: 42, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH19', topic: '기속행위·재량행위', importance: 'S',
        question: '행정처분에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '술에 취한 상태에서 경찰공무원의 측정에 응하지 아니한 때에는 필요적으로 운전면허를 취소하도록 되어 있으므로 재량권의 일탈·남용의 문제는 생길 수 없다.', ox: true, stamp: ['A'] },
            { num: 2, text: '청소년유해매체물 결정·고시처분은 관련 웹사이트 운영자에게 통지하지 않으면 효력이 발생하지 아니한다.', ox: true, stamp: ['P'] },
            { num: 3, text: '기속행위에 대한 사법심사의 경우 법원은 행정청이 한 판단의 적법 여부를 독자의 입장에서 판정한다.', ox: true, stamp: ['S'] },
            { num: 4, text: '개발행위허가와 농지전용허가·협의는 불확정개념으로 규정된 부분이 많아 행정청의 재량판단의 영역에 속한다.', ox: true, stamp: ['A'] }
        ], answer: 2, keywords: ['기속행위', '재량행위', '운전면허취소', '개발행위허가', '통지']
    },

    {
        id: 43, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH04', topic: '부관', importance: 'S',
        question: '행정행위의 부관에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '행정청이 부담을 부가하기 이전에 상대방과 협의하여 부담의 내용을 협약의 형식으로 미리 정한 다음 수익적 행정처분을 하면서 이를 부가할 수 있다.', ox: true, stamp: [] },
            { num: 2, text: '수익적 행정처분과 부관 사이에 실제적 관련성이 없는 경우 사법상 계약 형식의 부담은 위법하다.', ox: true, stamp: [] },
            { num: 3, text: '행정처분에 붙인 부담이 무효라 하더라도 특별한 사정이 없는 한 부담 이행으로 한 사법상 매매 등의 법률행위 자체까지 당연히 무효가 되는 것은 아니다.', ox: true, stamp: ['P'] },
            { num: 4, text: '수익적 처분에 붙인 부담이 처분 당시 법령을 기준으로 적법하더라도 처분 후 근거법령이 개정되어 부관을 붙일 수 없게 되었다면 그러한 부담은 곧바로 위법하게 된다.', ox: false, stamp: ['T', 'P'] }
        ], answer: 4, keywords: ['부관', '부담', '실제적관련성', '법령개정', '위법']
    },

    {
        id: 44, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH05', topic: '공정력·구성요건적효력', importance: 'S',
        question: '행정행위의 효력에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '처분은 권한이 있는 기관이 취소 또는 철회하거나 기간의 경과 등으로 소멸되기 전까지는 유효한 것으로 통용된다. 다만, 무효인 처분은 처음부터 그 효력이 발생하지 아니한다.', ox: true, stamp: [] },
            { num: 2, text: '항고소송에서 행정처분이 적법하다고 주장하는 피고가 그 적법사유에 대한 입증책임을 부담하는 것은, 처분의 공정력을 부정하는 것이 아니며 입증책임과 공정력은 별개의 문제이다.', ox: true, stamp: ['P'] },
            { num: 3, text: '무죄판결이 확정되었더라도 운전면허 취소처분이 취소되지 않은 상태에서 계속 운전하면 무면허운전죄로 처벌하여야 한다.', ox: true, stamp: ['P'] },
            { num: 4, text: '시정명령이 당연무효가 아니더라도 위법한 것으로 인정되는 한 시정명령 위반죄가 성립될 수 없다.', ox: false, stamp: ['P'] }
        ], answer: 4, keywords: ['공정력', '구성요건적효력', '무죄판결', '시정명령']
    },

    {
        id: 45, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH08', topic: '행정절차', importance: 'S',
        question: '행정절차에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '징벌처분이 규정에 반하여 교도소장이 아닌 관구교감에 의해 고지되었다면 절차상 하자로 국가배상책임이 인정된다.', ox: true, stamp: ['S'] },
            { num: 2, text: '처분에 법령상 근거가 있는지, 행정절차법에서 정한 처분절차를 준수하였는지는 본안에서 판단할 요소이지 소송요건 심사단계에서 고려할 요소가 아니다.', ox: true, stamp: [] },
            { num: 3, text: '보직해임처분은 처분의 근거와 이유 제시 등에 관한 행정절차법의 규정이 별도로 적용되지 아니한다.', ox: true, stamp: ['S'] },
            { num: 4, text: '신청에 따른 처분이 이루어지지 아니한 경우 신청에 대한 거부처분은 직접 당사자의 권익을 제한하는 것이므로 처분의 사전통지대상이 된다.', ox: false, stamp: ['P'] }
        ], answer: 4, keywords: ['절차적하자', '사전통지', '보직해임', '거부처분']
    },

    {
        id: 46, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH17', topic: '정보공개', importance: 'A',
        question: '정보공개법에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '제3자가 비공개를 요청한 경우 공공기관은 비공개 결정을 하여야 한다.', ox: false, stamp: ['A'] },
            { num: 2, text: '보안관찰 관련 통계자료는 비공개대상정보에 해당하지 아니한다.', ox: true, stamp: ['P'] },
            { num: 3, text: '아파트재건축주택조합의 사업수익성 검토 자료는 비공개대상정보에 해당하지 않는다.', ox: false, stamp: ['P'] },
            { num: 4, text: '법원을 통하여 청구인에게 정보를 공개하는 셈이 되었다면 비공개결정의 취소를 구할 소의 이익은 소멸된다.', ox: false, stamp: ['P'] }
        ], answer: 2, keywords: ['정보공개', '비공개', '보안관찰', '소의이익']
    },

    {
        id: 47, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH18', topic: '사인의 공법행위', importance: 'S',
        question: '사인의 공법행위로서의 신고에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '인·허가의제 효과를 수반하는 건축신고는 특별한 사정이 없는 한 실체적 요건에 관한 심사를 한 후 수리하여야 한다.', ox: true, stamp: ['A'] },
            { num: 2, text: '노인의료복지시설의 폐지신고는 수리를 필요로 하는 신고에 해당하지만, 행정청이 수리한 경우 수리행위가 당연무효로 되는 것은 아니다.', ox: true, stamp: ['P'] },
            { num: 3, text: '지위승계신고의 수리 대상인 사업양도·양수가 무효인 때에는 수리도 당연무효이고, 양도자는 행정소송으로 신고수리처분의 무효 확인을 구할 법률상 이익이 있다.', ox: true, stamp: [] },
            { num: 4, text: '노동조합의 설립신고가 수리되었더라도 법에서 정한 실질적 요건을 갖추지 못하였다면 특별한 사정이 없는 한 설립은 무효이다.', ox: true, stamp: ['P'] }
        ], answer: 2, keywords: ['수리를요하는신고', '자기완결적신고', '지위승계신고', '노동조합설립']
    },

    {
        id: 48, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH20', topic: '과징금', importance: 'A',
        question: '과징금에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '과징금의 근거법률에는 부과·징수 주체, 부과 사유, 상한액, 가산금, 체납 시 강제징수 사항까지 명확하게 규정해야 한다.', ox: true, stamp: ['M'] },
            { num: 2, text: '부당내부거래에 대해 형사처벌과 과징금의 병과를 예정하더라도 이중처벌금지원칙에 위반되지 않는다.', ox: true, stamp: ['P'] },
            { num: 3, text: '공정거래위원회의 경고를 받아 벌점이 부과되고 과징금에 반영되더라도 그 경고는 행정소송의 대상이 되는 처분에 해당하지 않는다.', ox: true, stamp: ['P'] },
            { num: 4, text: '과징금 납부명령이 재량권 일탈·남용으로 위법한지는 의결일 당시의 사실상태를 기준으로 판단하여야 한다.', ox: true, stamp: ['T'] }
        ], answer: 1, keywords: ['과징금', '이중처벌금지', '경고', '의결일기준']
    },

    {
        id: 49, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH09', topic: '행정상 강제', importance: 'S',
        question: '행정상 강제에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '의무자가 의무를 이행하면 새로운 이행강제금의 부과를 즉시 중지하고, 이미 부과한 이행강제금도 징수해서는 안 된다.', ox: false, stamp: ['P'] },
            { num: 2, text: '행정대집행법에서는 법령등에 따라 부과한 의무의 불이행만 대집행 대상으로 삼고 법령등에서 직접 명령한 의무는 대상이 아니다.', ox: false, stamp: ['P'] },
            { num: 3, text: '직접강제는 급박한 행정상의 장해를 제거하기 위한 것으로서 다른 수단으로는 달성할 수 없는 경우에만 허용되며 최소한으로만 실시하여야 한다.', ox: false, stamp: ['M'] },
            { num: 4, text: '형사·행형·보안처분 관계 법령에 따른 사항이나 외국인의 출입국·난민인정·귀화·국적회복에 관한 사항에는 행정기본법상 행정상 강제 규정이 적용되지 않는다.', ox: true, stamp: ['S'] }
        ], answer: 4, keywords: ['이행강제금', '행정대집행', '직접강제', '적용제외']
    },

    {
        id: 50, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH02', topic: '행정입법', importance: 'S',
        question: '행정입법에 대한 설명으로 옳은 것만을 모두 고르면?', type: 'combination',
        choices: [
            { num: 1, text: 'ㄱ, ㄴ', ox: false, stamp: [] },
            { num: 2, text: 'ㄱ, ㄷ', ox: false, stamp: [] },
            { num: 3, text: 'ㄴ, ㄷ', ox: false, stamp: [] },
            { num: 4, text: 'ㄱ, ㄴ, ㄷ', ox: true, stamp: [] }
        ], answer: 4, keywords: ['법규명령', '행정규칙', '고시', '처분적고시'],
        subItems: ['ㄱ. 시행령이나 시행규칙의 내용이 모법의 해석상 가능한 것을 명시한 것이면 직접 위임규정이 없어도 무효가 아니다.', 'ㄴ. 법령의 위임 없이 처분 요건을 변경한 부령은 행정명령의 성격을 가질 뿐 대외적 구속력이 없다.', 'ㄷ. 고시가 직접 국민의 구체적인 권리의무를 규율하면 항고소송의 대상이 되는 행정처분에 해당한다.']
    },

    {
        id: 51, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH09', topic: '행정벌', importance: 'A',
        question: '행정벌에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '과태료재판에서 법원은 행정청의 부과처분사유와 기본적 사실관계에서 동일성이 인정되는 한도 내에서만 과태료를 부과할 수 있다.', ox: true, stamp: ['M'] },
            { num: 2, text: '양벌규정에 따른 영업주의 처벌은 종업원의 실제 처벌이 이루어진 경우에만 가능하고, 그 책임은 무과실책임으로 본다.', ox: false, stamp: ['P'] },
            { num: 3, text: '질서위반행위규제법에 따르면 과태료는 객관적 사실에 대하여 과해지는 것으로 위반자의 고의·과실을 요하지 않는다.', ox: false, stamp: ['P'] },
            { num: 4, text: '기관위임사무의 경우 지방자치단체는 양벌규정에 의한 처벌대상이 되는 법인에 해당한다.', ox: false, stamp: ['S'] }
        ], answer: 1, keywords: ['과태료', '양벌규정', '질서위반행위', '기관위임사무']
    },

    {
        id: 52, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH03', topic: '행정작용', importance: 'A',
        question: '행정작용에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '잠정적 처분인 선행처분이 후행처분으로 흡수되어 소멸하면 선행처분의 취소를 구하는 소는 부적법하다.', ox: true, stamp: [] },
            { num: 2, text: '국가인권위원회의 성희롱결정 및 시정조치권고는 행정소송의 대상이 되는 행정처분에 해당한다고 볼 수 없다.', ox: true, stamp: ['P'] },
            { num: 3, text: '구치소 내 과밀수용행위는 피청구인이 우월적 지위에서 일방적으로 행한 권력적 사실행위로서 헌법소원심판의 대상이 된다.', ox: true, stamp: [] },
            { num: 4, text: '지방자치단체를 당사자로 하는 계약은 사법상 계약인 경우에만 「지방자치단체를 당사자로 하는 계약에 관한 법률」이 적용된다.', ox: false, stamp: ['M', 'P'] }
        ], answer: 4, keywords: ['선행처분', '성희롱결정', '과밀수용', '공법상계약']
    },

    {
        id: 53, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH14', topic: '국가배상', importance: 'S',
        question: '「국가배상법」상 국가배상책임에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '행정입법의무의 불이행으로 소매점에 대한 장애인의 접근권이 침해된 경우 정신적 손해는 추상적 수준에 머물러 위자료 지급의무가 배제된다.', ox: false, stamp: ['P'] },
            { num: 2, text: '공무원의 직무집행이 법령이 정한 요건과 절차에 따라 이루어진 것이라면 특별한 사정이 없는 한 법령에 적합한 것이다.', ox: true, stamp: [] },
            { num: 3, text: '법관의 재판에 법령의 규정을 따르지 아니한 잘못이 있어도 바로 국가배상법상 위법한 행위가 되는 것은 아니다.', ox: true, stamp: ['P'] },
            { num: 4, text: '행정청이 법률에서 위임받은 사항을 불충분하게 규정하여 행정입법의무를 제대로 이행하지 않은 경우도 위법하다.', ox: true, stamp: [] }
        ], answer: 1, keywords: ['국가배상', '행정입법의무', '법관재판', '위자료']
    },

    {
        id: 54, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH11', topic: '취소소송', importance: 'S',
        question: '행정소송법상 취소소송에 대한 설명으로 옳은 것만을 모두 고르면?', type: 'combination',
        choices: [
            { num: 1, text: 'ㄱ, ㄴ', ox: true, stamp: [] },
            { num: 2, text: 'ㄱ, ㄷ', ox: false, stamp: [] },
            { num: 3, text: 'ㄴ, ㄷ', ox: false, stamp: [] },
            { num: 4, text: 'ㄱ, ㄴ, ㄷ', ox: false, stamp: [] }
        ], answer: 1, keywords: ['처분성', '원고적격', '감액처분', '사실상통지'],
        subItems: ['ㄱ. 직장가입자 자격상실 안내 통보는 사실상 통지행위에 불과하여 처분성이 인정되지 않는다.', 'ㄴ. 사단법인 대한의사협회는 건강보험요양급여행위 고시의 취소를 구할 원고적격이 없다.', 'ㄷ. 징수금 감액처분은 당초 징수결정과 별개 독립의 처분이므로 징수 의무자에게 감액처분의 취소를 구할 소의 이익이 있다.']
    },

    {
        id: 55, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH15', topic: '손실보상', importance: 'A',
        question: '행정상 손실보상에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '경찰관의 적법한 직무집행으로 인하여 손실이 발생한 경우에는 손실을 보상하지 아니한다.', ox: false, stamp: ['P'] },
            { num: 2, text: '필수예방접종에 관한 국가의 보상책임은 무과실책임이지만 질병·장애·사망이 예방접종에 기인한 것이어야 한다.', ox: true, stamp: [] },
            { num: 3, text: '수용 대상 토지의 보상액 산정 시 해당 공익사업을 직접 목적으로 하는 계획에 의한 가격변동은 고려하지 않는다.', ox: true, stamp: ['T'] },
            { num: 4, text: '사업시행자는 이주대책기준을 정하여 택지 또는 주택의 내용이나 수량을 정하는 데 재량을 가진다.', ox: true, stamp: ['A'] }
        ], answer: 1, keywords: ['손실보상', '경찰관직무집행', '예방접종', '이주대책']
    },

    {
        id: 56, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH14', topic: '영조물 하자', importance: 'S',
        question: '영조물의 설치·관리의 하자로 인한 국가배상책임에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '공공의 영조물은 소유권 등 권한에 기하여 관리하고 있는 경우만을 말하며 사실상 관리하는 경우는 제외된다.', ox: false, stamp: ['M'] },
            { num: 2, text: '영조물의 설치 및 관리에 완전무결한 상태를 유지할 정도의 고도의 안전성이 결여되면 곧 하자가 있다.', ox: false, stamp: ['M'] },
            { num: 3, text: '학교 건물에서 학생이 업무외 행위로 실족하여 사망한 경우라도 학교시설의 설치·관리상의 하자가 당연히 인정된다.', ox: false, stamp: ['P'] },
            { num: 4, text: '영조물의 설치·관리상의 하자가 공동원인의 하나가 되는 이상 손해는 하자에 의하여 발생한 것으로 볼 수 있다.', ox: true, stamp: [] }
        ], answer: 4, keywords: ['영조물', '하자', '공동원인', '완전무결']
    },

    {
        id: 57, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH11', topic: '제소기간', importance: 'S',
        question: '취소소송의 제소기간에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '고시 또는 공고에 의한 행정처분은 이해관계자가 현실적으로 알았는지와 관계없이 고시 효력 발생일에 처분이 있음을 안 것으로 본다.', ox: true, stamp: ['T'] },
            { num: 2, text: '행정청이 법정 심판청구기간보다 긴 기간으로 잘못 통지한 경우의 신뢰 보호는 행정심판뿐 아니라 행정소송을 제기한 경우에까지 확대된다.', ox: false, stamp: ['P'] },
            { num: 3, text: '주소불명 등으로 공고한 경우에는 상대방이 처분이 있었음을 현실적으로 안 날에 안 것으로 본다.', ox: true, stamp: ['T'] },
            { num: 4, text: '부작위위법확인의 소가 적법하게 제기된 후 처분취소소송으로 교환적 변경과 추가적 변경을 거치더라도 제소기간은 준수한 것으로 본다.', ox: true, stamp: ['T'] }
        ], answer: 2, keywords: ['제소기간', '고시', '공고', '잘못통지', '소변경']
    },

    {
        id: 58, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH22', topic: '변상금·부당이득', importance: 'A',
        question: '변상금에 관한 사례에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '국유재산의 점유나 사용·수익을 정당화할 법적 지위가 있었다면 변상금 부과처분은 당연무효이다.', ox: true, stamp: ['P'] },
            { num: 2, text: '변상금을 납부하고 제소기간 내에 취소소송을 제기하면서 부당이득반환도 병합 청구한 경우, 변상금 부과처분이 위법하다는 판결 확정 전에는 부당이득반환을 인용할 수 없다.', ox: true, stamp: ['T'] },
            { num: 3, text: '변상금 부과처분에 취소사유에 불과한 하자가 있으면 항고소송 없이 부당이득반환청구만으로는 인용할 수 없다.', ox: true, stamp: [] },
            { num: 4, text: '변상금 부과·징수권의 행사로 민사상 부당이득반환청구권의 소멸시효가 중단된다.', ox: false, stamp: ['P'] }
        ], answer: 4, keywords: ['변상금', '부당이득반환', '소멸시효', '당연무효']
    },

    {
        id: 59, year: 2025, exam: '국가직7급', grade: 7, chapter: 'CH04', topic: '부관 사례', importance: 'A',
        question: '사도개설허가의 부관에 관한 사례에 대한 설명으로 옳은 것만을 모두 고르면?', type: 'combination',
        choices: [
            { num: 1, text: 'ㄱ, ㄴ', ox: false, stamp: [] },
            { num: 2, text: 'ㄱ, ㄷ', ox: true, stamp: [] },
            { num: 3, text: 'ㄴ, ㄷ', ox: false, stamp: [] },
            { num: 4, text: 'ㄱ, ㄴ, ㄷ', ox: false, stamp: [] }
        ], answer: 2, keywords: ['사도개설허가', '거부처분', '소변경', '공사기간', '실효'],
        subItems: ['ㄱ. 거부처분(B처분)에 대상적격이 인정되려면 취소를 구할 법규상 또는 조리상의 신청권이 필요하다.', 'ㄴ. B처분에서 A처분에 대한 취소소송으로 소변경 시 제소기간은 당초 B처분에 대한 소 제기 시를 기준으로 한다.', 'ㄷ. 공사기간이 사도개설에 충분하지 않으면 기간 내 준공검사를 받지 못하여도 허가가 당연히 실효되는 것은 아니다.']
    },

    // ===== 2023 국가직 9급 추가 문항 =====
    {
        id: 60, year: 2023, exam: '국가직', grade: 9, chapter: 'CH02', topic: '행정입법', importance: 'S',
        question: '행정입법에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '국회의 위임에 따른 행정입법 불이행은 위법이며, 입법이 이루어질 때까지 행정명령의 효력을 가진다.', ox: false, stamp: ['P'] },
            { num: 2, text: '법규명령의 위헌·위법 여부는 대법원이 최종 심사권을 가진다.', ox: true, stamp: ['S'] },
            { num: 3, text: '총리령과 부령은 모두 법규명령의 형식이다.', ox: true, stamp: [] },
            { num: 4, text: '법규명령 형식의 행정규칙은 법규명령에 해당하지 않으므로 헌법소원의 대상이 될 수 있다.', ox: true, stamp: ['P'] }
        ], answer: 1, keywords: ['법규명령', '행정규칙', '위임입법', '대법원심사권']
    },

    {
        id: 61, year: 2023, exam: '국가직', grade: 9, chapter: 'CH03', topic: '행정행위의 종류', importance: 'A',
        question: '행정행위의 종류에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '허가는 법령에 의한 절대적 금지를 해제하여 새로운 권리를 설정하는 행위이다.', ox: false, stamp: ['P'] },
            { num: 2, text: '특허는 상대적 금지를 해제하여 적법하게 일정한 행위를 할 수 있게 하는 행위이다.', ox: false, stamp: ['P'] },
            { num: 3, text: '인가는 제3자의 법률행위를 보충하여 그 효력을 완성시켜 주는 행위이다.', ox: true, stamp: [] },
            { num: 4, text: '하명은 국민에게 의무를 면제하여 주는 행위이다.', ox: false, stamp: ['P'] }
        ], answer: 3, keywords: ['허가', '특허', '인가', '하명']
    },

    {
        id: 62, year: 2023, exam: '국가직', grade: 9, chapter: 'CH14', topic: '국가배상', importance: 'S',
        question: '국가배상법에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '국가배상법 제2조의 위법은 직무행위 자체가 법령을 위반한 경우뿐 아니라 직무행위를 함에 있어 객관적 주의의무를 다하지 아니한 경우도 포함한다.', ox: true, stamp: ['M'] },
            { num: 2, text: '공무원의 직무에는 권력적 작용만이 아니라 비권력적 작용도 포함된다.', ox: true, stamp: [] },
            { num: 3, text: '대위책임이 아닌 자기책임의 입장에서 공무원 개인의 고의·중과실 시에만 국가가 구상권을 행사할 수 있다.', ox: false, stamp: ['P'] },
            { num: 4, text: '직무집행의 외관을 갖추고 있으면 실질적으로 직무범위에 속하지 않아도 국가배상책임이 인정될 수 있다.', ox: true, stamp: [] }
        ], answer: 3, keywords: ['국가배상', '위법성', '직무범위', '구상권', '자기책임']
    },

    {
        id: 63, year: 2023, exam: '국가직', grade: 9, chapter: 'CH11', topic: '원고적격', importance: 'S',
        question: '취소소송의 원고적격에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '법률상 이익이란 처분의 근거 법규에 의해 보호되는 직접적·구체적 이익을 말한다.', ox: true, stamp: ['M'] },
            { num: 2, text: '반사적 이익이 침해된 경우에도 원고적격이 인정된다.', ox: false, stamp: ['P'] },
            { num: 3, text: '경업자의 영업허가취소를 구하는 인근 주민은 항상 원고적격이 인정된다.', ox: false, stamp: ['M'] },
            { num: 4, text: '처분의 상대방이 아닌 제3자는 어떤 경우에도 원고적격이 인정되지 않는다.', ox: false, stamp: ['M', 'P'] }
        ], answer: 1, keywords: ['원고적격', '법률상이익', '반사적이익', '제3자']
    },

    {
        id: 64, year: 2023, exam: '국가직', grade: 9, chapter: 'CH15', topic: '손실보상', importance: 'A',
        question: '손실보상에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '헌법 제23조 제3항의 정당한 보상이란 원칙적으로 완전보상을 의미한다.', ox: true, stamp: [] },
            { num: 2, text: '개발이익은 손실보상의 범위에 포함되지 않는다.', ox: true, stamp: [] },
            { num: 3, text: '사업시행자에 의한 손실보상은 현금보상이 원칙이지만 채권·토지보상도 가능하다.', ox: true, stamp: [] },
            { num: 4, text: '수용재결에 대한 이의가 있는 토지소유자는 중앙토지수용위원회에 이의신청 없이 바로 행정소송을 제기할 수 있다.', ox: true, stamp: [] }
        ], answer: 2, keywords: ['완전보상', '개발이익', '현금보상', '이의신청']
    },

    // ===== 2025 소방승진(소방위) 선별 문항 =====
    {
        id: 65, year: 2025, exam: '소방승진', grade: 0, chapter: 'CH01', topic: '행정기본법·법원', importance: 'S',
        question: '행정법의 법원(法源)에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '관습법은 성문의 법률에 우선하여 적용된다.', ox: false, stamp: ['P'] },
            { num: 2, text: '행정법의 일반원칙인 신뢰보호원칙은 헌법적 효력을 가진다.', ox: true, stamp: [] },
            { num: 3, text: '행정규칙은 어떤 경우에도 법규적 효력을 가질 수 없다.', ox: false, stamp: ['M', 'P'] },
            { num: 4, text: '조례는 법률의 위임이 없으면 주민의 권리를 제한하는 규정을 둘 수 없으나, 의무를 부과하는 것은 가능하다.', ox: false, stamp: ['P'] }
        ], answer: 2, keywords: ['법원', '관습법', '신뢰보호', '행정규칙', '조례']
    },

    {
        id: 66, year: 2025, exam: '소방승진', grade: 0, chapter: 'CH06', topic: '행정행위의 취소·철회', importance: 'S',
        question: '행정행위의 취소·철회에 대한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '위법한 처분이라도 정당한 신뢰이익이 공익보다 큰 경우에는 취소가 제한된다.', ox: true, stamp: [] },
            { num: 2, text: '수익적 처분의 직권취소는 상대방의 귀책사유 유무에 관계없이 별도의 법적 근거가 필요하다.', ox: false, stamp: ['P'] },
            { num: 3, text: '철회는 적법한 처분의 효력을 사후적 사유로 장래에 향하여 소멸시키는 것이다.', ox: true, stamp: [] },
            { num: 4, text: '당연무효인 처분에 대해서도 취소소송을 제기할 수 있다.', ox: true, stamp: ['P'] }
        ], answer: 2, keywords: ['직권취소', '철회', '수익적처분', '당연무효']
    },

    {
        id: 67, year: 2025, exam: '소방승진', grade: 0, chapter: 'CH05', topic: '하자의 치유·전환', importance: 'A',
        question: '행정행위의 하자에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '하자의 치유는 무효인 행정행위에 대해서도 인정된다.', ox: false, stamp: ['P'] },
            { num: 2, text: '하자의 전환은 당초 행정행위와 전환되는 행정행위 사이에 목적·효과 면에서 동일성이 있어야 한다.', ox: false, stamp: ['M'] },
            { num: 3, text: '절차상 하자가 있는 과세처분이 납세의무자의 자진납부로 치유될 수 없다.', ox: true, stamp: ['P'] },
            { num: 4, text: '행정행위의 하자의 승계는 선행행위가 무효인 경우에만 인정된다.', ox: false, stamp: ['M', 'P'] }
        ], answer: 3, keywords: ['하자치유', '하자전환', '하자승계', '절차적하자']
    },

    {
        id: 68, year: 2025, exam: '소방승진', grade: 0, chapter: 'CH08', topic: '처분의 이유제시', importance: 'S',
        question: '행정절차에 관한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '직위해제처분은 처분의 사전통지 및 의견청취 등에 관한 행정절차법의 규정이 별도로 적용되지 않는다.', ox: true, stamp: ['S'] },
            { num: 2, text: '세액산출근거가 기재되지 아니한 납세고지서에 의한 부과처분의 하자는 사후 자진납부로도 치유되지 않는다.', ox: true, stamp: ['P'] },
            { num: 3, text: '행정청과 당사자가 청문절차 배제 협약을 체결하더라도 법령상 근거 없이는 청문 적용을 배제할 수 없다.', ox: true, stamp: [] },
            { num: 4, text: '퇴직연금 환수결정은 당사자에게 의무를 과하는 처분이므로 사전통지대상에 해당하나, 거부처분도 사전통지를 하여야 한다.', ox: false, stamp: ['P'] }
        ], answer: 4, keywords: ['사전통지', '이유제시', '청문', '직위해제', '환수결정']
    },

    {
        id: 69, year: 2025, exam: '소방승진', grade: 0, chapter: 'CH09', topic: '행정벌', importance: 'A',
        question: '행정벌에 관한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '자치사무를 처리하면서 위반행위를 한 경우 지방자치단체는 양벌규정에 의한 처벌대상 법인에 해당하지 않는다.', ox: true, stamp: ['S'] },
            { num: 2, text: '양벌규정에 의한 영업주 처벌은 종업원의 처벌에 종속하지 않고 독립하여 선임감독상 과실로 처벌된다.', ox: true, stamp: [] },
            { num: 3, text: '관세범에 대하여 통고처분 없이 고발하였다는 것만으로 공소제기가 부적법하게 되지 않는다.', ox: true, stamp: ['P'] },
            { num: 4, text: '도로교통법상 경찰서장의 통고처분은 행정소송의 대상이 되는 행정처분에 해당한다.', ox: false, stamp: ['P'] }
        ], answer: 4, keywords: ['양벌규정', '통고처분', '자치사무', '처분성']
    },

    {
        id: 70, year: 2025, exam: '소방승진', grade: 0, chapter: 'CH11', topic: '취소소송 소의이익', importance: 'S',
        question: '행정소송에 관한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '부작위위법확인소송은 행정심판 전치를 거친 경우에도 제소기간의 제한을 받지 않는다.', ox: false, stamp: ['P'] },
            { num: 2, text: '원천징수의무자인 법인에 대한 소득금액변동통지는 납세의무에 직접 영향을 미치는 행정처분이다.', ox: true, stamp: [] },
            { num: 3, text: '거부처분 후 동일내용의 재신청에 대한 재거절은 새로운 처분이 된다.', ox: false, stamp: ['P'] },
            { num: 4, text: '선행처분의 주요 부분을 변경하는 후행처분이 있으면 선행처분은 전부 소멸한다.', ox: false, stamp: ['M'] }
        ], answer: 2, keywords: ['부작위위법확인', '소득금액변동통지', '거부처분', '선행처분']
    },

    {
        id: 71, year: 2025, exam: '소방승진', grade: 0, chapter: 'CH23', topic: '행정심판', importance: 'A',
        question: '행정심판법의 규정상 기간으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '처분이 있음을 알게 된 날부터 90일, 불가항력 소멸일부터 14일, 처분이 있었던 날부터 180일', ox: true, stamp: ['T'] },
            { num: 2, text: '처분이 있음을 알게 된 날부터 90일, 불가항력 소멸일부터 21일, 처분이 있었던 날부터 1년', ox: false, stamp: ['T'] },
            { num: 3, text: '처분이 있음을 알게 된 날부터 90일, 불가항력 소멸일부터 14일, 처분이 있었던 날부터 180일, 변경불허가결정 이의 7일', ox: false, stamp: ['T'] },
            { num: 4, text: '처분이 있음을 알게 된 날부터 180일, 불가항력 소멸일부터 21일, 처분이 있었던 날부터 90일', ox: false, stamp: ['T'] }
        ], answer: 1, keywords: ['행정심판', '청구기간', '90일', '180일', '14일']
    },

    {
        id: 72, year: 2025, exam: '소방승진', grade: 0, chapter: 'CH11', topic: '피고적격', importance: 'S',
        question: '취소소송의 원고 및 피고에 대한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '위임행정청의 위임을 받아 수임행정청이 수임 명의로 처분한 경우 위임행정청이 피고이다.', ox: false, stamp: ['S'] },
            { num: 2, text: '처분 후 행정청이 없어진 경우 원고 신청에 의하여 재판장이 직권으로 피고를 결정한다.', ox: false, stamp: ['S'] },
            { num: 3, text: '원고가 피고를 잘못 지정한 경우 법원은 석명권을 행사하여 정당한 피고로 경정하게 하여야 한다.', ox: true, stamp: [] },
            { num: 4, text: '행정기관의 내부적 인사문제에 관한 조치요구는 당사자능력과 원고적격이 없다.', ox: false, stamp: ['P'] }
        ], answer: 3, keywords: ['피고적격', '석명권', '피고경정', '위임행정청']
    },

    {
        id: 73, year: 2025, exam: '소방승진', grade: 0, chapter: 'CH14', topic: '국가배상 위법성', importance: 'S',
        question: '국가배상에 관한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '항고소송에서 처분이 취소되었다면 그 기판력에 의하여 곧바로 공무원의 고의·과실에 의한 불법행위가 된다.', ox: false, stamp: ['P'] },
            { num: 2, text: '공무원의 직무집행이 법령이 정한 요건과 절차에 따른 것이라면 개인의 권리침해가 있더라도 법령 적합성이 곧바로 부정되지 않는다.', ox: true, stamp: [] },
            { num: 3, text: '공무원이 직무집행을 위하여 관용차를 운행하다가 사고를 낸 경우 그 공무원은 자동차손해배상보장법상 운행자 책임의 주체가 될 수 없다.', ox: true, stamp: ['S'] },
            { num: 4, text: '외국인이 피해자인 경우 해당 국가와 상호 보증이 있을 때에만 국가배상법이 적용된다.', ox: true, stamp: [] }
        ], answer: 1, keywords: ['국가배상', '위법성', '기판력', '상호보증', '관용차']
    },

    {
        id: 74, year: 2025, exam: '소방승진', grade: 0, chapter: 'CH15', topic: '손실보상', importance: 'A',
        question: '행정상 손실보상에 관한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '정당한 보상이란 공익과 사익을 형량한 상당보상을 의미한다.', ox: false, stamp: ['M', 'P'] },
            { num: 2, text: '철새 도래지로서의 학술가치는 토지의 경제적 가치를 높이지 않으므로 손실보상 대상이 아니다.', ox: true, stamp: ['P'] },
            { num: 3, text: '경찰관의 적법한 직무집행에 자발적으로 협조하여 피해를 입은 경우에도 국가는 보상의무가 없다.', ox: false, stamp: ['P'] },
            { num: 4, text: '공유수면 매립면허 고시만으로 실질적 피해 없이도 손실보상청구권이 발생한다.', ox: false, stamp: ['P'] }
        ], answer: 2, keywords: ['손실보상', '정당보상', '학술가치', '자발적협조']
    },

    {
        id: 75, year: 2025, exam: '소방승진', grade: 0, chapter: 'CH02', topic: '법규명령의 한계', importance: 'S',
        question: '행정입법에 관한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '법률에서 위임받은 사항을 전혀 규정하지 않은 경우뿐만 아니라 불충분하게 규정한 경우도 입법부작위에 해당할 수 있다.', ox: true, stamp: [] },
            { num: 2, text: '재위임은 법률이 직접 대통령령으로 정할 것을 요구하더라도 총리령이나 부령에 재위임할 수 있다.', ox: false, stamp: ['P'] },
            { num: 3, text: '행정규칙이 반복 시행되어 행정관행이 성립되면 평등원칙이나 신뢰보호원칙에 따라 대외적 구속력이 인정될 수 있다.', ox: true, stamp: [] },
            { num: 4, text: '위임명령이 위임 범위를 벗어나면 법규명령으로서의 효력이 부인된다.', ox: true, stamp: [] }
        ], answer: 2, keywords: ['재위임', '법규명령', '행정규칙', '입법부작위']
    },

    // ===== 2025 소방 간부후보 선별 문항 =====
    {
        id: 76, year: 2025, exam: '소방간부', grade: 0, chapter: 'CH09', topic: '행정대집행', importance: 'S',
        question: '행정상 강제에 관한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '행정대집행이 가능한 경우에도 별도로 민사소송의 방법으로 의무이행을 구할 수 있다.', ox: false, stamp: ['P'] },
            { num: 2, text: '건물철거의무에 퇴거의무가 포함되므로 행정대집행 시 별도의 퇴거 집행권원이 불필요하다.', ox: false, stamp: ['P'] },
            { num: 3, text: '직접강제는 대집행이나 이행강제금으로 의무이행 확보가 불가능한 경우에만 실시할 수 있다.', ox: false, stamp: ['A'] },
            { num: 4, text: '독촉절차 없이 압류처분을 하였더라도 그것만으로 무효가 되는 중대·명백한 하자가 되지 않는다.', ox: true, stamp: ['P'] }
        ], answer: 4, keywords: ['행정대집행', '직접강제', '압류처분', '독촉절차']
    },

    {
        id: 77, year: 2025, exam: '소방간부', grade: 0, chapter: 'CH14', topic: '국가배상 범위', importance: 'S',
        question: '국가배상법상 국가배상책임에 관한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '국가배상청구의 직무행위는 공권력적 작용만을 의미하며 비권력적 공행정작용은 포함하지 않는다.', ox: false, stamp: ['M'] },
            { num: 2, text: '직무상 의무가 공공일반의 이익만을 위한 것이라면 공무원이 의무를 위반해도 국가배상이 인정되지 않는다.', ox: false, stamp: ['P'] },
            { num: 3, text: '항고소송에서 위법 판단되어 취소되었다는 사정만으로 곧바로 국가배상의 불법행위가 성립하지는 않는다.', ox: true, stamp: ['P'] },
            { num: 4, text: '직무수행 중 경과실로 불법행위를 한 공무원이 피해자에게 직접 배상한 경우 국가에 대한 구상권이 인정되지 않는다.', ox: false, stamp: ['P'] }
        ], answer: 3, keywords: ['국가배상', '비권력작용', '항고소송취소', '구상권']
    },

    {
        id: 78, year: 2025, exam: '소방간부', grade: 0, chapter: 'CH14', topic: '영조물 하자', importance: 'S',
        question: '영조물의 설치·관리 하자로 인한 국가배상에 관한 옳은 설명을 모두 고르면?', type: 'combination',
        choices: [
            { num: 1, text: 'ㄱ, ㄷ, ㅁ', ox: false, stamp: [] },
            { num: 2, text: 'ㄱ, ㄴ, ㄷ', ox: false, stamp: [] },
            { num: 3, text: 'ㄱ, ㄷ', ox: false, stamp: [] },
            { num: 4, text: 'ㄱ, ㄷ, ㅁ', ox: true, stamp: [] }
        ], answer: 4, keywords: ['영조물', '하자', '사실상관리', '구상권', '경과실'],
        subItems: ['ㄱ. 가해공무원이 경과실인 경우에는 국가배상책임을 이행한 국가가 구상할 수 없다.', 'ㄴ. 직무관련 공상 소방공무원이 먼저 국가배상을 받으면 다른 법령에 따른 보상을 받을 수 없다.', 'ㄷ. 외국인이 피해자인 경우 해당 국가와 상호 보증이 있을 때에만 적용한다.', 'ㄹ. 국가배상청구소송 전에 반드시 배상심의회에 배상신청을 거쳐야 한다.', 'ㅁ. 공공의 영조물에는 사실상의 관리를 하고 있는 물적 설비도 포함된다.']
    },

    {
        id: 79, year: 2025, exam: '소방간부', grade: 0, chapter: 'CH15', topic: '수용재결', importance: 'A',
        question: '행정상 손실보상에 관한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '협의취득이 사법상 법률행위라 하더라도 당사자가 매매대금 과부족금 약정을 할 수 없다.', ox: false, stamp: ['P'] },
            { num: 2, text: '수용재결 후에도 토지소유자와 사업시행자가 다시 협의하여 임의로 계약을 체결할 수 있다.', ox: true, stamp: [] },
            { num: 3, text: '농업의 손실을 입은 자는 재결절차를 거치지 않고 곧바로 사업시행자에게 보상을 청구할 수 있다.', ox: false, stamp: ['A'] },
            { num: 4, text: '토지수용위원회가 보상항목을 잘못 제외한 경우 피보상자는 토지수용위원회를 상대로 취소소송만 제기할 수 있다.', ox: false, stamp: ['A'] }
        ], answer: 2, keywords: ['수용재결', '협의취득', '농업손실', '보상금증액']
    },

    {
        id: 80, year: 2025, exam: '소방간부', grade: 0, chapter: 'CH23', topic: '행정심판 재결', importance: 'A',
        question: '甲이 A시장의 거부처분에 대해 행정심판을 통해 다투는 경우 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '甲은 거부처분취소심판을 제기할 수도 있고 의무이행심판을 제기할 수도 있다.', ox: true, stamp: [] },
            { num: 2, text: '甲은 행정심판청구서를 A시장에게 제출하여도 된다.', ox: true, stamp: [] },
            { num: 3, text: 'A시장은 당초 거부처분의 사유와 기본적 사실관계의 동일성이 인정되지 않는 다른 처분사유를 추가·변경할 수 없다.', ox: true, stamp: [] },
            { num: 4, text: '甲의 행정심판청구에 대해 재결이 있으면 甲은 그 재결에 대하여 다시 행정심판을 청구할 수 없다.', ox: true, stamp: [] }
        ], answer: 3, keywords: ['행정심판', '거부처분', '의무이행심판', '처분사유추가변경']
    },

    {
        id: 81, year: 2025, exam: '소방간부', grade: 0, chapter: 'CH11', topic: '취소소송요건', importance: 'S',
        question: '취소소송의 소송요건에 관한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '처분의 근거가 행정규칙에 규정되어 있으면 취소소송의 대상이 될 수 없다.', ox: false, stamp: ['P'] },
            { num: 2, text: '국유 일반재산에 대한 대부신청 거부행위는 취소소송 대상인 행정처분에 해당한다.', ox: false, stamp: ['P'] },
            { num: 3, text: '제소시에 원고적격이 인정되면 사실심 변론종결시까지 유지되어야 한다.', ox: true, stamp: ['T'] },
            { num: 4, text: '행정소송법상 처분의 효과가 기간경과로 소멸되면 처분의 위법성 확인 필요성과 관계없이 소의 이익이 소멸한다.', ox: false, stamp: ['P'] }
        ], answer: 3, keywords: ['원고적격', '행정규칙', '대부신청', '소의이익']
    },

    // ===== 2025 소방 행정법총론 선별 문항 =====
    {
        id: 82, year: 2025, exam: '소방총론', grade: 0, chapter: 'CH01', topic: '평등원칙·부당결부금지', importance: 'S',
        question: '행정법의 일반원칙에 관한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '부당결부금지원칙이란 행정작용과 이에 관련된 상대방의 반대급부 사이에 실질적 관련성이 있어야 한다는 원칙이다.', ox: true, stamp: [] },
            { num: 2, text: '행정청은 합리적 이유 없이 국민을 차별하여서는 아니 된다는 것은 평등의 원칙이다.', ox: true, stamp: [] },
            { num: 3, text: '제재적 행정처분이 사회통념상 재량권의 범위를 벗어나면 비례원칙에 위배된다.', ox: true, stamp: [] },
            { num: 4, text: '신뢰보호원칙은 행정의 법률적합성 원칙에 항상 우선한다.', ox: false, stamp: ['M', 'P'] }
        ], answer: 4, keywords: ['부당결부금지', '평등원칙', '비례원칙', '신뢰보호']
    },

    {
        id: 83, year: 2025, exam: '소방총론', grade: 0, chapter: 'CH03', topic: '행정행위의 성립·효력', importance: 'S',
        question: '행정행위의 효력에 관한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '행정행위의 불가쟁력이 발생하면 당사자는 물론 행정청도 더 이상 그 효력을 다툴 수 없다.', ox: false, stamp: ['S', 'P'] },
            { num: 2, text: '행정처분의 불복기간 경과로 확정되면 판결과 같은 기판력이 인정된다.', ox: false, stamp: ['P'] },
            { num: 3, text: '무효인 행정행위에는 공정력이 인정되지 않는다.', ox: true, stamp: [] },
            { num: 4, text: '행정행위의 구성요건적 효력은 처분청에 대해서만 인정되고 다른 행정기관에는 미치지 않는다.', ox: false, stamp: ['M'] }
        ], answer: 3, keywords: ['불가쟁력', '기판력', '공정력', '구성요건적효력']
    },

    {
        id: 84, year: 2025, exam: '소방총론', grade: 0, chapter: 'CH07', topic: '행정계획', importance: 'B',
        question: '행정계획에 관한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '도시계획시설결정에 이해관계가 있는 주민에게 도시시설계획의 입안·변경을 요구할 신청권이 인정된다.', ox: true, stamp: [] },
            { num: 2, text: '관계이익의 이익형량을 전혀 하지 않거나 정당성이 결여되면 재량권 일탈·남용으로 위법하다.', ox: true, stamp: [] },
            { num: 3, text: '대학교육역량강화사업 기본계획은 행정처분성이 인정되지 않으나 헌법소원의 대상이 될 수 있다.', ox: true, stamp: [] },
            { num: 4, text: '행정계획은 항상 법적 구속력을 가지며 국민의 권리·의무를 직접 변동시킨다.', ox: false, stamp: ['M', 'P'] }
        ], answer: 4, keywords: ['행정계획', '이익형량', '신청권', '헌법소원']
    },

    {
        id: 85, year: 2025, exam: '소방총론', grade: 0, chapter: 'CH16', topic: '공법상 계약', importance: 'A',
        question: '행정법관계에서의 계약에 관한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '국가를 당사자로 하는 계약은 공법상 계약이므로 민법의 적용이 배제된다.', ox: false, stamp: ['P'] },
            { num: 2, text: '공법상 계약에 따른 권리·의무의 확인 또는 이행청구소송은 당사자소송의 대상이 된다.', ox: true, stamp: [] },
            { num: 3, text: '국가나 공기업이 일방 당사자가 되는 계약도 반드시 행정소송으로 다투어야 한다.', ox: false, stamp: ['M'] },
            { num: 4, text: '공법상 계약은 행정청이 일방적으로 체결할 수 있으므로 상대방의 동의가 불필요하다.', ox: false, stamp: ['P'] }
        ], answer: 2, keywords: ['공법상계약', '당사자소송', '국가계약', '사법상계약']
    },

    {
        id: 86, year: 2025, exam: '소방총론', grade: 0, chapter: 'CH09', topic: '이행강제금', importance: 'S',
        question: '이행강제금에 관한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '행정청은 이행강제금 부과 전에 적절한 이행기간을 정하여 문서로 계고하여야 한다.', ox: true, stamp: ['A'] },
            { num: 2, text: '이행강제금을 내지 아니하면 국세강제징수의 예에 따라 징수한다.', ox: true, stamp: [] },
            { num: 3, text: '시정명령의 기간을 지나서 의무를 이행한 경우에도 이행강제금을 부과할 수 있다.', ox: false, stamp: ['P'] },
            { num: 4, text: '이행강제금 납부의무는 일신전속적이므로 이미 사망한 사람에 대한 부과는 당연무효이다.', ox: true, stamp: [] }
        ], answer: 3, keywords: ['이행강제금', '계고', '국세강제징수', '일신전속']
    },

    {
        id: 87, year: 2025, exam: '소방총론', grade: 0, chapter: 'CH09', topic: '행정대집행 절차', importance: 'S',
        question: '행정대집행에 관한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '대집행 비용에 대해 행정청은 국세에 다음가는 순위의 선취득권을 가진다.', ox: true, stamp: [] },
            { num: 2, text: '건물철거 대집행 제1차 계고 후 불응 시 제2차 계고서를 발송한 경우 제2차 계고처분도 항고소송 대상이다.', ox: true, stamp: [] },
            { num: 3, text: '1장의 문서로 자진철거 명령과 불이행 시 대집행 계고를 동시에 할 수 있고 각각 독립된 요건이 충족되어야 한다.', ox: true, stamp: [] },
            { num: 4, text: '대집행의 대상은 대체적 작위의무에 한정되며 비대체적 작위의무에 대해서도 대집행이 가능하다.', ox: false, stamp: ['P'] }
        ], answer: 4, keywords: ['행정대집행', '계고처분', '대체적작위의무', '선취득권']
    },

    {
        id: 88, year: 2025, exam: '소방총론', grade: 0, chapter: 'CH20', topic: '제재처분', importance: 'A',
        question: '행정의 실효성 확보수단에 관한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '시정명령의 상대방은 행정법상 위반사실을 야기할 수 있는 법률상·사실상 지위에 있는 자여야 한다.', ox: true, stamp: ['S'] },
            { num: 2, text: '공급거부란 의무위반자에 대하여 행정서비스 공급을 거부하는 권력적 사실행위로서 단수조치의 처분성이 인정된다.', ox: true, stamp: [] },
            { num: 3, text: '과징금은 위반행위에 대해 부과하는 제재로서 분할납부가 원칙이며 일정 사유 시 일괄납부하게 할 수 있다.', ox: false, stamp: ['P'] },
            { num: 4, text: '병역의무 기피자 인적사항의 인터넷 공개는 항고소송의 대상이 되는 행정처분에 해당한다.', ox: true, stamp: [] }
        ], answer: 3, keywords: ['시정명령', '공급거부', '과징금', '공표']
    },

    // ===== 26년 소방간부 행정법 선별 문항 =====
    {
        id: 89, year: 2026, exam: '소방간부', grade: 0, chapter: 'CH01', topic: '법의 일반원칙', importance: 'A',
        question: '법의 일반원칙에 관한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '사인이 한-EU FTA 위반을 주장하여 직접 국내 법원에 정부를 상대로 처분의 취소를 구할 수 있다.', ox: false, stamp: ['P'] },
            { num: 2, text: '행정청의 공적 견해표명이 위법하더라도 상대방의 귀책사유 없는 신뢰가 형성된 경우 이를 취소할 수 없다.', ox: false, stamp: ['P'] },
            { num: 3, text: '국세기본법상 세무조사권 남용 금지 규정은 선언적 효력만 가질 뿐 구체적 법규적 효력이 없다.', ox: false, stamp: ['P'] },
            { num: 4, text: '상급심 재판의 하급심에 대한 기속력은 같은 종류의 다른 사건에는 미치지 않는다.', ox: true, stamp: [] }
        ], answer: 4, keywords: ['기속력', '세무조사권', 'FTA', '견해표명']
    },

    {
        id: 90, year: 2026, exam: '소방간부', grade: 0, chapter: 'CH11', topic: '집행정지·가구제', importance: 'S',
        question: '행정쟁송상 가구제에 관한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '행정심판법상 집행정지로 목적을 달성할 수 있는 경우에도 임시처분이 허용된다.', ox: false, stamp: ['P'] },
            { num: 2, text: '집행정지결정 후 본안소송에서 패소확정판결을 받으면 집행정지결정의 효력은 소급하여 소멸한다.', ox: false, stamp: ['T', 'P'] },
            { num: 3, text: '집행정지결정 후 본안소송이 취하되면 별도로 집행정지결정을 취소하여야 한다.', ox: false, stamp: ['P'] },
            { num: 4, text: '행정처분의 효력정지나 집행정지 신청사건에서 본안청구가 적법한 것이어야 한다는 것은 집행정지의 요건에 포함된다.', ox: false, stamp: ['P'] }
        ], answer: 4, keywords: ['집행정지', '임시처분', '패소확정', '본안적법성']
    },

    {
        id: 91, year: 2026, exam: '소방간부', grade: 0, chapter: 'CH11', topic: '처분성', importance: 'S',
        question: '항고소송의 대상(처분성)에 관한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '근로복지공단의 사업종류 변경결정은 항고소송 대상인 처분에 해당한다.', ox: true, stamp: [] },
            { num: 2, text: '군인 명예전역수당 지급대상자 추천 또는 비추천 행위는 항고소송 대상이 아니다.', ox: true, stamp: ['P'] },
            { num: 3, text: '비법인 임의단체 계장의 해임·임명 행위는 통상의 행정처분 방식으로 이루어져도 처분에 해당하지 않는다.', ox: true, stamp: [] },
            { num: 4, text: '총포·화약안전기술협회의 회비납부통지는 항고소송 대상인 처분에 해당한다.', ox: false, stamp: ['P'] }
        ], answer: 4, keywords: ['처분성', '사업종류변경', '명예전역수당', '회비납부통지']
    },

    {
        id: 92, year: 2026, exam: '소방간부', grade: 0, chapter: 'CH11', topic: '원고적격', importance: 'S',
        question: '항고소송의 원고적격에 관한 옳은 설명을 모두 고르면?', type: 'combination',
        choices: [
            { num: 1, text: 'ㄴ, ㄷ, ㄹ', ox: true, stamp: [] },
            { num: 2, text: 'ㄱ, ㄷ, ㅁ', ox: false, stamp: [] },
            { num: 3, text: 'ㄱ, ㄹ, ㅁ', ox: false, stamp: [] },
            { num: 4, text: 'ㄴ, ㄹ, ㅁ', ox: false, stamp: [] }
        ], answer: 1, keywords: ['원고적격', '약국개설자', '법무사회', '집합건물', '생태자연도'],
        subItems: ['ㄱ. 신규 약국개설등록처분으로 기존 약국개설자가 매출 감소가 상당해야만 법률상 이익 침해를 인정할 수 있다.', 'ㄴ. 채용승인 거부처분에 대해 법무사뿐 아니라 사무원이 될 수 없게 된 사람도 원고적격이 있다.', 'ㄷ. 국민권익위원회가 소방청장에게 인사관련 취소요구를 한 경우 소방청장은 원고적격이 있다.', 'ㄹ. 집합건물 공용부분 대수선 관련 처분에 대해 구분소유자에게도 원고적격이 있다.', 'ㅁ. 생태자연도 1등급 권역의 인근 주민은 등급변경 결정의 무효확인을 구할 원고적격이 있다.']
    },

    {
        id: 93, year: 2026, exam: '소방간부', grade: 0, chapter: 'CH11', topic: '처분사유 추가·변경', importance: 'S',
        question: '거부처분 취소소송에서 처분사유의 추가·변경에 관한 설명으로 옳은 것을 고르면?', type: 'combination',
        choices: [
            { num: 1, text: 'ㄱ', ox: false, stamp: [] },
            { num: 2, text: 'ㄴ', ox: false, stamp: [] },
            { num: 3, text: 'ㄱ, ㄷ', ox: true, stamp: [] },
            { num: 4, text: 'ㄴ, ㄷ', ox: false, stamp: [] }
        ], answer: 3, keywords: ['처분사유추가변경', '기속력', '석명권', '기본적사실관계'],
        subItems: ['ㄱ. 당초 사유와 추가 사유의 기본적 사실관계 동일성이 없더라도 원고가 실체적 당부 심리에 명시적으로 동의하면 허용된다.', 'ㄴ. 추가 사유가 허용되지 않은 채 원고 승소 확정 후 행정청이 추가 사유로 다시 거부하는 것은 재처분의무 이행이다.', 'ㄷ. 행정청이 추가 사유를 주장할 때 원고가 의견을 밝히지 않으면 법원은 석명권을 행사하여야 한다.']
    },

    {
        id: 94, year: 2026, exam: '소방간부', grade: 0, chapter: 'CH02', topic: '권한의 위임·위탁', importance: 'A',
        question: '행정청의 권한의 위임·위탁에 관한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '위임의 경우 수임관청이 자기의 이름으로 권한행사를 할 수 있다.', ox: true, stamp: [] },
            { num: 2, text: '내부위임에 불과한 행정청이 자신의 명의로 한 처분에 대한 항고소송의 피고는 처분명의자인 행정청이다.', ox: true, stamp: ['S'] },
            { num: 3, text: '전결규정에 위반하여 보조기관이 처분권자 이름으로 한 행정처분은 당연무효이다.', ox: false, stamp: ['P'] },
            { num: 4, text: '전결규정에 의한 내부적 결재방법에 관한 것에 불과한 경우 법령에 의한 적법한 위임이 있다고 볼 수 없다.', ox: true, stamp: [] }
        ], answer: 3, keywords: ['위임', '위탁', '내부위임', '전결규정', '피고적격']
    },

    {
        id: 95, year: 2026, exam: '소방간부', grade: 0, chapter: 'CH08', topic: '행정절차·이유제시', importance: 'S',
        question: '행정절차에 관한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '영업정지처분 시 처분의 이유를 구체적으로 제시하여야 하며 근거법령도 함께 기재하여야 한다.', ox: true, stamp: [] },
            { num: 2, text: '처분의 이유제시가 다소 미흡하더라도 처분서의 기재 및 관계법령을 종합하면 처분 이유를 알 수 있는 경우에는 위법하지 않다.', ox: true, stamp: [] },
            { num: 3, text: '군인사법에 의한 전역처분에 행정절차법이 적용되며 사전통지와 의견제출 기회를 부여해야 한다.', ox: false, stamp: ['S', 'P'] },
            { num: 4, text: '당사자가 전자문서로 처분을 신청하면 행정청의 컴퓨터에 입력된 때에 신청한 것으로 본다.', ox: true, stamp: ['T'] }
        ], answer: 3, keywords: ['이유제시', '사전통지', '전역처분', '전자문서']
    },

    {
        id: 96, year: 2026, exam: '소방간부', grade: 0, chapter: 'CH17', topic: '정보공개', importance: 'A',
        question: '정보공개법에 관한 설명으로 옳은 것과 옳지 않은 것의 조합으로 바른 것은?', type: 'combination',
        choices: [
            { num: 1, text: 'ㄱ(×), ㄴ(○), ㄷ(○), ㄹ(○)', ox: true, stamp: [] },
            { num: 2, text: 'ㄱ(×), ㄴ(○), ㄷ(×), ㄹ(○)', ox: false, stamp: [] },
            { num: 3, text: 'ㄱ(○), ㄴ(×), ㄷ(×), ㄹ(○)', ox: false, stamp: [] },
            { num: 4, text: 'ㄱ(×), ㄴ(○), ㄷ(○), ㄹ(×)', ox: false, stamp: [] }
        ], answer: 1, keywords: ['정보공개', '비공개대상', '민원처리', '감독행정기관'],
        subItems: ['ㄱ. 직무를 수행한 공무원의 성명·직위는 사생활 침해 우려로 비공개 대상정보에 해당한다.', 'ㄴ. 정보의 양이 너무 많아 업무에 지장이 있으면 일정 기간별로 나누어 제공할 수 있다.', 'ㄷ. 보유·관리하지 않는 정보로서 민원으로 처리 가능하면 민원으로 처리할 수 있다.', 'ㄹ. 국가기관 외의 공공기관 결정에 대한 감독행정기관은 관계 중앙행정기관의 장 또는 지방자치단체의 장이다.']
    },

    {
        id: 97, year: 2026, exam: '소방간부', grade: 0, chapter: 'CH14', topic: '국가배상 상호보증', importance: 'S',
        question: '국가배상법상 국가배상책임에 관한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '상호보증은 외국의 법령·판례·관례에 의해 인정되어야 할 뿐만 아니라 조약이 체결되어 있어야 한다.', ox: false, stamp: ['M'] },
            { num: 2, text: '공법인이 위탁받은 공행정사무 집행 중 손해를 입히면 국가배상법상 공무원에 해당하므로 고의·중과실 시에만 배상책임을 진다.', ox: false, stamp: ['M', 'P'] },
            { num: 3, text: '공무원의 직무상 자동차 운전 사고의 경우 과실의 정도를 가리지 않고 운행자에 해당하면 자동차손해배상보장법 책임을 진다.', ox: true, stamp: [] },
            { num: 4, text: '공무원에 대한 전보인사가 법령에 위배되었다면 그 사유만으로 불법행위를 구성한다.', ox: false, stamp: ['P'] }
        ], answer: 3, keywords: ['상호보증', '공법인', '자동차사고', '전보인사']
    },

    {
        id: 98, year: 2026, exam: '소방간부', grade: 0, chapter: 'CH15', topic: '손실보상 기준', importance: 'A',
        question: '행정상 손실보상에 관한 설명으로 옳은 것은?', type: 'positive',
        choices: [
            { num: 1, text: '헌법은 재산권 수용의 주체를 국가 등 공적기관으로 한정하므로 민간기업은 수용의 주체가 될 수 없다.', ox: false, stamp: ['M'] },
            { num: 2, text: '정당한 보상이란 완전보상을 뜻하며 보상금액뿐 아니라 보상의 시기나 방법에도 제한을 두어서는 안 된다.', ox: true, stamp: [] },
            { num: 3, text: '약사에게 인정된 한약조제권은 구체적 권리이지만 헌법상 재산권 보장대상이 아니다.', ox: false, stamp: ['P'] },
            { num: 4, text: '농업손실 보상은 농지소유자가 아닌 경우에도 실제 경작자에게 보상해서는 안 된다.', ox: false, stamp: ['P'] }
        ], answer: 2, keywords: ['완전보상', '수용주체', '한약조제권', '농업손실']
    },

    {
        id: 99, year: 2026, exam: '소방간부', grade: 0, chapter: 'CH23', topic: '행정심판', importance: 'A',
        question: '행정심판법상 행정심판에 관한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '처분청이 고지의무를 이행하지 아니하여도 행정심판 제기기간이 연장될 수 있는 것에 그치고 처분에 하자가 수반되지 않는다.', ox: true, stamp: [] },
            { num: 2, text: '감사원의 시정요구에 따른 부과처분이더라도 동일 사실에 대해 특별한 사유 없이 되풀이하면 위법하다.', ox: true, stamp: ['P'] },
            { num: 3, text: '법인이 아닌 사단·재단으로서 대표자가 정해져 있으면 그 사단·재단의 이름으로 심판청구를 할 수 있다.', ox: true, stamp: [] },
            { num: 4, text: '재결은 심판청구서를 받은 날부터 60일 이내이며 부득이한 경우 위원장 직권으로 60일까지 연장할 수 있다.', ox: false, stamp: ['T'] }
        ], answer: 4, keywords: ['행정심판', '고지의무', '감사원시정요구', '재결기간']
    },

    {
        id: 100, year: 2026, exam: '소방간부', grade: 0, chapter: 'CH11', topic: '소의이익·피고적격', importance: 'S',
        question: '취소소송의 소의 이익과 피고적격에 관한 설명으로 옳지 않은 것은?', type: 'negative',
        choices: [
            { num: 1, text: '내부위임을 받은 하급행정청이 권한 없이 처분을 한 경우에도 피고는 실제 처분을 행한 하급행정청이다.', ox: true, stamp: ['S'] },
            { num: 2, text: '국립대학교 불합격처분 취소소송에서 당해년도 입학시기가 지나면 법률상 이익이 없다.', ox: false, stamp: ['P'] },
            { num: 3, text: '토석채취 허가기간이 경과하여 허가가 실효되면 취소처분의 취소를 구하는 소의 이익이 없다.', ox: true, stamp: [] },
            { num: 4, text: '처분의 효과가 소멸하였더라도 동일한 사유로 위법한 처분이 반복될 위험이 있으면 예외적으로 소의 이익이 인정된다.', ox: true, stamp: [] }
        ], answer: 2, keywords: ['소의이익', '피고적격', '내부위임', '불합격처분', '반복위험']
    }
];

// OX 변환 문제 생성 함수
function generateOXFromChoice(q, choiceIdx) {
    const c = q.choices[choiceIdx];
    return {
        questionId: q.id,
        chapter: q.chapter,
        topic: q.topic,
        importance: q.importance,
        text: c.text,
        answer: c.ox,
        stamp: c.stamp,
        keywords: q.keywords,
        year: q.year,
        exam: q.exam
    };
}
