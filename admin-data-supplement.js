// 행정학 보충문항 (국가직 9급 고빈출 누락 주제 보강)
const ADMIN_QUESTIONS_SUPPLEMENT = [
    {
        id: 9101,
        year: 2026,
        exam: '국가직',
        chapter: 'CH05',
        topic: '공공선택론(뷰캐넌·털럭)',
        importance: 'S',
        question: '공공선택론에 대한 설명으로 옳은 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '정책결정자는 공익만을 추구하는 완전한 후견인이라고 본다.', ox: false, what: ['A'], keywords: ['후견인 국가', '공익극대화'], stamp: ['A'] },
            { num: 2, text: '집합선택을 경제학적으로 분석하며 개인의 합리적 선택을 전제로 한다.', ox: true, what: ['W'], keywords: ['집합선택', '합리적 선택', '뷰캐넌', '털럭'], stamp: ['W'] },
            { num: 3, text: '정부실패 개념을 부정하고 정부개입의 무오류성을 전제한다.', ox: false, what: ['A'], keywords: ['정부실패 부정'], stamp: ['A'] },
            { num: 4, text: '관료의 예산극대화 가설은 오스트롬의 핵심 주장이다.', ox: false, what: ['W'], keywords: ['예산극대화', '오스트롬', '니스카넨'], stamp: ['W'] }
        ],
        answer: 2,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9102,
        year: 2026,
        exam: '국가직',
        chapter: 'CH05',
        topic: '오스트롬 공유자원 관리',
        importance: 'A',
        question: '오스트롬(Ostrom)의 공유자원 이론에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '공유자원도 적절한 제도 설계를 통해 자치적으로 관리될 수 있다.', ox: true, what: ['W'], keywords: ['공유자원', '자치관리', '오스트롬'], stamp: ['W'] },
            { num: 2, text: '공유자원 문제는 반드시 중앙정부의 직접 통제만으로 해결 가능하다고 본다.', ox: false, what: ['A'], keywords: ['중앙정부 직접통제', '반드시'], stamp: ['A'] },
            { num: 3, text: '이용자 집단의 규칙과 상호감시가 제도 성과에 영향을 준다.', ox: true, what: ['H'], keywords: ['규칙', '상호감시'], stamp: ['H'] },
            { num: 4, text: '공유자원 관리에서 현장 맥락과 제도적 다양성을 중시한다.', ox: true, what: ['H'], keywords: ['제도 다양성', '현장 맥락'], stamp: ['H'] }
        ],
        answer: 2,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9103,
        year: 2026,
        exam: '국가직',
        chapter: 'CH05',
        topic: '정책평가(형성·총괄·모니터링)',
        importance: 'S',
        question: '정책평가 유형에 대한 설명으로 옳은 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '형성평가는 정책이 종료된 뒤 최종 성과만을 평가한다.', ox: false, what: ['T'], keywords: ['형성평가', '종료 후'], stamp: ['T'] },
            { num: 2, text: '총괄평가는 집행 중 개선을 위한 실시간 피드백에 초점을 둔다.', ox: false, what: ['T'], keywords: ['총괄평가', '집행 중'], stamp: ['T'] },
            { num: 3, text: '모니터링은 집행 과정에서 지속적으로 정보를 수집·점검하는 활동이다.', ox: true, what: ['H'], keywords: ['모니터링', '지속 점검', '집행 과정'], stamp: ['H'] },
            { num: 4, text: '정책평가는 정책 대안의 사전 설계 단계에서만 수행된다.', ox: false, what: ['A'], keywords: ['정책평가', '사전 설계만'], stamp: ['A'] }
        ],
        answer: 3,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9104,
        year: 2026,
        exam: '국가직',
        chapter: 'CH04',
        topic: '조세지출',
        importance: 'S',
        question: '조세지출에 대한 설명으로 옳은 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '조세지출은 예산상 직접 보조금 지급만을 의미한다.', ox: false, what: ['A'], keywords: ['직접보조금'], stamp: ['A'] },
            { num: 2, text: '비과세·감면·공제 등을 통해 조세체계 내에서 지원효과를 내는 제도다.', ox: true, what: ['H'], keywords: ['비과세', '감면', '공제', '조세지출'], stamp: ['H'] },
            { num: 3, text: '조세지출은 재정운용에 영향을 주지 않으므로 정책평가 대상이 아니다.', ox: false, what: ['T'], keywords: ['재정영향 없음'], stamp: ['T'] },
            { num: 4, text: '조세지출은 공공정책 수단으로 활용될 수 없고 순수한 세무기술이다.', ox: false, what: ['A'], keywords: ['정책수단 부정'], stamp: ['A'] }
        ],
        answer: 2,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9105,
        year: 2026,
        exam: '국가직',
        chapter: 'CH06',
        topic: '행정협의회',
        importance: 'A',
        question: '행정협의회에 대한 설명으로 옳은 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '행정협의회는 단일 지방자치단체 내부 부서 간 조정기구만을 말한다.', ox: false, what: ['H'], keywords: ['단일 자치단체 내부'], stamp: ['H'] },
            { num: 2, text: '둘 이상의 지방자치단체가 관련 사무를 공동 처리하거나 연락·조정하기 위한 협의기구다.', ox: true, what: ['H'], keywords: ['행정협의회', '공동처리', '연락조정'], stamp: ['H'] },
            { num: 3, text: '행정협의회는 국가사무만 처리할 수 있고 자치사무는 다룰 수 없다.', ox: false, what: ['A'], keywords: ['국가사무만'], stamp: ['A'] },
            { num: 4, text: '행정협의회는 필연적으로 독립된 법인격을 가져야만 한다.', ox: false, what: ['T'], keywords: ['법인격 필수'], stamp: ['T'] }
        ],
        answer: 2,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9106,
        year: 2026,
        exam: '국가직',
        chapter: 'CH06',
        topic: '특별지방행정기관',
        importance: 'A',
        question: '특별지방행정기관에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '중앙행정기관이 지방에서 국가사무를 수행하기 위해 설치한 하부행정기관이다.', ox: true, what: ['H'], keywords: ['특별지방행정기관', '중앙행정기관 하부'], stamp: ['H'] },
            { num: 2, text: '전국적 통일성이 요구되는 사무를 수행할 필요성과 연결된다.', ox: true, what: ['H'], keywords: ['전국적 통일성'], stamp: ['H'] },
            { num: 3, text: '지방분권 강화를 위해 지방자치단체와 기능을 더 중복시키는 것이 일반 원칙이다.', ox: false, what: ['A'], keywords: ['기능중복', '지방분권'], stamp: ['A'] },
            { num: 4, text: '지방자치단체와의 기능 중복이 자치권 약화 논란으로 이어질 수 있다.', ox: true, what: ['T'], keywords: ['기능중복 논란', '자치권 약화'], stamp: ['T'] }
        ],
        answer: 3,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9107,
        year: 2026,
        exam: '국가직',
        chapter: 'CH03',
        topic: '시보임용·소청심사',
        importance: 'S',
        question: '공무원 인사제도에 대한 설명으로 옳은 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '5급 이상 공무원의 시보임용 기간은 원칙적으로 6개월이다.', ox: false, what: ['T'], keywords: ['시보임용', '5급 이상', '6개월'], stamp: ['T'] },
            { num: 2, text: '6급 이하 공무원의 시보임용 기간은 원칙적으로 6개월이다.', ox: true, what: ['T'], keywords: ['시보임용', '6급 이하', '6개월'], stamp: ['T'] },
            { num: 3, text: '소청심사 청구기간은 처분사유 설명서를 받은 날부터 90일이다.', ox: false, what: ['T'], keywords: ['소청심사', '90일'], stamp: ['T'] },
            { num: 4, text: '소청심사위원회는 법원 소속 사법기관으로 운영된다.', ox: false, what: ['A'], keywords: ['소청심사위원회', '사법기관'], stamp: ['A'] }
        ],
        answer: 2,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9108,
        year: 2026,
        exam: '국가직',
        chapter: 'CH01',
        topic: '시장실패·정부실패',
        importance: 'S',
        question: '시장실패와 정부실패에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '공공재의 비배제성·비경합성은 시장실패의 대표적 원인이다.', ox: true, what: ['H'], keywords: ['공공재', '비배제성', '비경합성', '시장실패'], stamp: ['H'] },
            { num: 2, text: '외부효과는 사적비용과 사회적비용의 괴리를 발생시킬 수 있다.', ox: true, what: ['H'], keywords: ['외부효과', '사적비용', '사회적비용'], stamp: ['H'] },
            { num: 3, text: '내부성 및 파생적 외부효과는 정부실패 논의에서 제시되는 원인이다.', ox: true, what: ['H'], keywords: ['내부성', '파생적 외부효과', '정부실패'], stamp: ['H'] },
            { num: 4, text: '자연독점은 경쟁을 충분히 보장하므로 시장실패와 무관하다.', ox: false, what: ['A'], keywords: ['자연독점', '경쟁 보장'], stamp: ['A'] }
        ],
        answer: 4,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9109,
        year: 2026,
        exam: '국가직',
        chapter: 'CH05',
        topic: '정책유형(Salisbury)',
        importance: 'A',
        question: 'Salisbury의 정책유형 분류 기준으로 옳은 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '요구패턴과 결정체제를 기준으로 정책유형을 분류한다.', ox: true, what: ['W'], keywords: ['Salisbury', '요구패턴', '결정체제'], stamp: ['W'] },
            { num: 2, text: '정책의 강제성과 적용범위를 기준으로 분류한다.', ox: false, what: ['A'], keywords: ['Lowi', '강제성'], stamp: ['A'] },
            { num: 3, text: '비용과 편익의 분산·집중을 기준으로 분류한다.', ox: false, what: ['A'], keywords: ['Wilson', '비용편익'], stamp: ['A'] },
            { num: 4, text: '정책유형이 아니라 정부실패 유형을 분류하기 위한 기준이다.', ox: false, what: ['A'], keywords: ['정부실패 유형'], stamp: ['A'] }
        ],
        answer: 1,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9110,
        year: 2026,
        exam: '국가직',
        chapter: 'CH04',
        topic: '정부지출 증가이론(바그너·전위효과·보몰)',
        importance: 'A',
        question: '정부지출 증가이론에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '바그너 법칙은 산업화가 진행될수록 국가활동과 재정규모가 확대된다고 본다.', ox: true, what: ['W'], keywords: ['바그너 법칙', '산업화', '재정확대'], stamp: ['W'] },
            { num: 2, text: '피콕-와이즈먼의 전위효과는 위기 시 지출 급증 후 이전 수준으로 완전히 복귀하지 않을 수 있음을 설명한다.', ox: true, what: ['W'], keywords: ['전위효과', '피콕', '와이즈먼'], stamp: ['W'] },
            { num: 3, text: '보몰효과는 공공부문의 상대적 노동생산성 정체와 임금상승으로 비용이 증가할 수 있음을 강조한다.', ox: true, what: ['W'], keywords: ['보몰효과', '노동생산성', '비용증가'], stamp: ['W'] },
            { num: 4, text: '전위효과는 위기 종료 직후 정부지출이 반드시 위기 이전 수준으로 즉시 환원됨을 전제한다.', ox: false, what: ['T'], keywords: ['전위효과', '즉시 환원'], stamp: ['T'] }
        ],
        answer: 4,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9111,
        year: 2026,
        exam: '국가직',
        chapter: 'CH05',
        topic: '정책결정모형(합리·점증·혼합)',
        importance: 'S',
        question: '정책결정모형에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '합리모형은 완전한 정보와 대안의 종합적 검토를 전제한다.', ox: true, what: ['H'], keywords: ['합리모형', '완전정보', '종합검토'], stamp: ['H'] },
            { num: 2, text: '점증모형은 기존 정책을 기준으로 소폭 수정하는 현실적 접근을 강조한다.', ox: true, what: ['H'], keywords: ['점증모형', '소폭 수정'], stamp: ['H'] },
            { num: 3, text: '혼합모형은 근본결정에서 점증모형, 세부결정에서 합리모형을 적용한다.', ox: false, what: ['T'], keywords: ['혼합모형', '근본결정', '세부결정'], stamp: ['T'] },
            { num: 4, text: '합리모형은 현실에서 정보·시간·비용 제약으로 비판받는다.', ox: true, what: ['A'], keywords: ['합리모형 비판', '제약'], stamp: ['A'] }
        ],
        answer: 3,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9112,
        year: 2026,
        exam: '국가직',
        chapter: 'CH02',
        topic: '동기부여이론(맥그리거·앨더퍼)',
        importance: 'A',
        question: '동기부여이론에 대한 설명으로 옳은 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '맥그리거 X이론은 인간이 본질적으로 자율적·창의적이라고 본다.', ox: false, what: ['W'], keywords: ['맥그리거', 'X이론'], stamp: ['W'] },
            { num: 2, text: '맥그리거 Y이론은 자아통제와 자기지향적 행동 가능성을 전제로 한다.', ox: true, what: ['W'], keywords: ['맥그리거', 'Y이론', '자기통제'], stamp: ['W'] },
            { num: 3, text: '앨더퍼 ERG이론은 하위욕구가 충족되기 전에는 상위욕구로 절대 이동할 수 없다고 본다.', ox: false, what: ['A'], keywords: ['앨더퍼', 'ERG이론'], stamp: ['A'] },
            { num: 4, text: '허즈버그 이론에서 위생요인은 동기요인보다 성과 유발 효과가 항상 크다.', ox: false, what: ['A'], keywords: ['허즈버그', '위생요인'], stamp: ['A'] }
        ],
        answer: 2,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9113,
        year: 2026,
        exam: '국가직',
        chapter: 'CH05',
        topic: '정책집행(하향·상향·상호작용)',
        importance: 'A',
        question: '정책집행 접근에 대한 설명으로 옳은 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '하향적 접근은 중앙의 명확한 목표와 통제구조를 강조한다.', ox: true, what: ['H'], keywords: ['하향적 접근', '중앙통제'], stamp: ['H'] },
            { num: 2, text: '상향적 접근은 일선집행자의 재량과 네트워크 영향을 무시한다.', ox: false, what: ['A'], keywords: ['상향적 접근', '일선집행자'], stamp: ['A'] },
            { num: 3, text: '하향적 접근과 상향적 접근은 이론적으로 결합이 불가능하다.', ox: false, what: ['A'], keywords: ['하향적', '상향적', '결합불가'], stamp: ['A'] },
            { num: 4, text: '상호작용 모형은 정책목표보다 집행환경을 배제하고 법적 명령만을 중시한다.', ox: false, what: ['T'], keywords: ['상호작용 모형', '집행환경'], stamp: ['T'] }
        ],
        answer: 1,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9114,
        year: 2026,
        exam: '국가직',
        chapter: 'CH08',
        topic: '데이터3법·전자정부',
        importance: 'A',
        question: '전자정부·정보화에 대한 설명으로 옳은 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '데이터3법은 개인정보보호법·정보통신망법·신용정보법 개정이 핵심이다.', ox: true, what: ['T'], keywords: ['데이터3법', '개인정보보호법', '정보통신망법', '신용정보법'], stamp: ['T'] },
            { num: 2, text: '데이터3법에는 데이터산업진흥법이 포함된다.', ox: false, what: ['T'], keywords: ['데이터산업진흥법'], stamp: ['T'] },
            { num: 3, text: '전자정부는 오프라인 행정 중심으로 회귀하여 디지털 통합서비스를 축소한다.', ox: false, what: ['A'], keywords: ['전자정부', '통합서비스'], stamp: ['A'] },
            { num: 4, text: '전자정부는 내부 행정업무에만 국한되고 대민서비스 혁신과는 무관하다.', ox: false, what: ['A'], keywords: ['전자정부', '대민서비스'], stamp: ['A'] }
        ],
        answer: 1,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9115,
        year: 2026,
        exam: '국가직',
        chapter: 'CH02',
        topic: '위원회 조직의 장단점',
        importance: 'A',
        question: '위원회 조직에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '합의제 운영을 통해 다양한 의견을 반영하고 신중한 결정을 도모할 수 있다.', ox: true, what: ['H'], keywords: ['위원회 조직', '합의제', '신중성'], stamp: ['H'] },
            { num: 2, text: '복수인 의사결정은 책임소재를 단일하게 명확히 하기에 유리하다.', ox: false, what: ['A'], keywords: ['위원회 조직', '책임소재'], stamp: ['A'] },
            { num: 3, text: '전문가 참여를 통해 전문성을 보완하는 기능을 기대할 수 있다.', ox: true, what: ['H'], keywords: ['전문성', '전문가 참여'], stamp: ['H'] },
            { num: 4, text: '조정 과정이 길어지면 의사결정 지연이 발생할 수 있다.', ox: true, what: ['T'], keywords: ['의사결정 지연'], stamp: ['T'] }
        ],
        answer: 2,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9116,
        year: 2026,
        exam: '국가직',
        chapter: 'CH02',
        topic: '리더십(변혁적·거래적)',
        importance: 'A',
        question: '리더십 이론에 대한 설명으로 옳은 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '거래적 리더십은 비전·가치 내면화를 중심으로 부하의 내적 동기를 일관되게 강조한다.', ox: false, what: ['A'], keywords: ['거래적 리더십', '내적동기'], stamp: ['A'] },
            { num: 2, text: '거래적 리더십은 보상과 교환관계를 통해 성과를 관리하는 접근이다.', ox: true, what: ['H'], keywords: ['거래적 리더십', '보상', '교환관계'], stamp: ['H'] },
            { num: 3, text: '변혁적 리더십은 조건적 보상만으로 성과를 통제하는 데 초점을 둔다.', ox: false, what: ['A'], keywords: ['변혁적 리더십', '조건적 보상'], stamp: ['A'] },
            { num: 4, text: '상황적 리더십은 구성원 성숙도와 무관하게 단일 리더십 유형을 고정적으로 적용한다.', ox: false, what: ['T'], keywords: ['상황적 리더십', '성숙도'], stamp: ['T'] }
        ],
        answer: 2,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9117,
        year: 2026,
        exam: '국가직',
        chapter: 'CH04',
        topic: '예산과정',
        importance: 'S',
        question: '일반적인 예산과정의 흐름으로 옳은 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '예산편성 → 예산집행 → 예산심의·확정 → 결산', ox: false, what: ['T'], keywords: ['예산과정', '순서'], stamp: ['T'] },
            { num: 2, text: '예산심의·확정 → 예산편성 → 결산 → 예산집행', ox: false, what: ['T'], keywords: ['예산심의', '예산편성'], stamp: ['T'] },
            { num: 3, text: '예산편성 → 예산심의·확정 → 예산집행 → 결산', ox: true, what: ['H'], keywords: ['예산편성', '예산심의·확정', '예산집행', '결산'], stamp: ['H'] },
            { num: 4, text: '결산 → 예산편성 → 예산심의·확정 → 예산집행', ox: false, what: ['A'], keywords: ['결산 선행'], stamp: ['A'] }
        ],
        answer: 3,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9118,
        year: 2026,
        exam: '국가직',
        chapter: 'CH05',
        topic: '공공선택이론 학자 매칭',
        importance: 'S',
        question: '다음 학자와 주장 연결로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '뷰캐넌·털럭: 집합선택의 경제학적 분석', ox: true, what: ['W'], keywords: ['뷰캐넌', '털럭', '집합선택'], stamp: ['W'] },
            { num: 2, text: '니스카넨: 관료의 예산극대화 가설', ox: true, what: ['W'], keywords: ['니스카넨', '예산극대화'], stamp: ['W'] },
            { num: 3, text: '오스트롬: 공유자원의 자치적 관리 가능성', ox: true, what: ['W'], keywords: ['오스트롬', '공유자원'], stamp: ['W'] },
            { num: 4, text: '뷰캐넌: 공공부문 규모 확장을 위한 관료 예산극대화 모형 제시', ox: false, what: ['T'], keywords: ['뷰캐넌', '예산극대화 모형'], stamp: ['T'] }
        ],
        answer: 4,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9119,
        year: 2026,
        exam: '국가직',
        chapter: 'CH05',
        topic: '정책평가(모니터링·형성·총괄) 2',
        importance: 'A',
        question: '정책평가에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '형성평가는 집행과정에서 개선을 위한 피드백 제공에 유용하다.', ox: true, what: ['H'], keywords: ['형성평가', '피드백'], stamp: ['H'] },
            { num: 2, text: '총괄평가는 정책 종료 후 성과와 효과를 종합적으로 판단한다.', ox: true, what: ['H'], keywords: ['총괄평가', '정책 종료 후'], stamp: ['H'] },
            { num: 3, text: '모니터링은 정책 종료 이후에만 단발적으로 실시하는 사후평가다.', ox: false, what: ['T'], keywords: ['모니터링', '사후평가'], stamp: ['T'] },
            { num: 4, text: '평가유형 선택은 정책 단계와 평가 목적에 따라 달라질 수 있다.', ox: true, what: ['A'], keywords: ['평가유형 선택', '정책 단계'], stamp: ['A'] }
        ],
        answer: 3,
        subject: '행정학',
        sourceCategory: '핵심누락 보충(국가직9급형)'
    },
    {
        id: 9120,
        year: 2025,
        exam: '국가직',
        chapter: 'CH04',
        topic: '예산제도(품목별·성과주의·PPBS·ZBB)',
        importance: 'S',
        question: '예산제도에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '영기준 예산제도는 점증주의를 극복하기 위한 경제적 합리성에 초점을 둔 제도이다.', ox: true, what: ['H'], keywords: ['영기준 예산', '점증주의 극복'], stamp: ['H'] },
            { num: 2, text: '품목별 예산제도는 지출대상을 품목별로 분류해서 지출대상과 한계를 규정하는 제도이다.', ox: true, what: ['H'], keywords: ['품목별 예산'], stamp: ['H'] },
            { num: 3, text: '성과주의 예산제도는 투입 요소 중심이 아니라 성과를 중심으로 예산을 운용하는 제도이다.', ox: true, what: ['H'], keywords: ['성과주의 예산'], stamp: ['H'] },
            { num: 4, text: '계획 예산제도는 계획에 기반한 상향식 접근을 선택하여 재원 배분 권한의 분권화를 강조하는 제도이다.', ox: false, what: ['A', 'T'], keywords: ['계획 예산', '상향식', '분권화', 'PPBS'], stamp: ['A', 'T'] }
        ],
        answer: 4,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['영기준 예산', 'ZBB', '품목별 예산', '성과주의 예산', '계획 예산', 'PPBS']
    },
    {
        id: 9121,
        year: 2025,
        exam: '국가직',
        chapter: 'CH01',
        topic: '정부실패(X-비효율성)',
        importance: 'S',
        question: '정부실패 원인 중 X-비효율성에 해당하는 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '조직의 비공식적 목표가 공식적 목표를 대체하는 현상', ox: false, what: ['A'], keywords: ['목표대치'], stamp: ['A'] },
            { num: 2, text: '공공서비스의 편익 향유와 비용 부담 주체의 분리', ox: false, what: ['A'], keywords: ['비용편익 분리'], stamp: ['A'] },
            { num: 3, text: '조직이 내부 특성으로 인해 최소비용에 의한 이윤극대화라는 효율성을 달성하지 못하는 상태', ox: true, what: ['H'], keywords: ['X-비효율성', '최소비용', '이윤극대화'], stamp: ['H'] },
            { num: 4, text: '정부개입에 의해 발생하는 인위적 지대를 획득하기 위해 자원을 낭비하는 현상', ox: false, what: ['A'], keywords: ['지대추구'], stamp: ['A'] }
        ],
        answer: 3,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['X-비효율성', '목표대치', '비용편익 분리', '지대추구']
    },
    {
        id: 9122,
        year: 2025,
        exam: '국가직',
        chapter: 'CH04',
        topic: '특별회계',
        importance: 'A',
        question: '특별회계에 대한 설명으로 옳은 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '예산총계주의 원칙의 예외에 해당한다.', ox: true, what: ['H'], keywords: ['특별회계', '예산총계주의 예외'], stamp: ['H'] },
            { num: 2, text: '양곡관리특별회계, 조달특별회계 등이 있다.', ox: false, what: ['T'], keywords: ['양곡관리', '조달'], stamp: ['T'] },
            { num: 3, text: '재정에 대한 외부통제가 용이하나 재정운영의 자율성을 침해한다는 단점이 있다.', ox: false, what: ['A'], keywords: ['외부통제 용이'], stamp: ['A'] },
            { num: 4, text: '법령에 따라 국가가 지급하여야 하는 지출이 발생하거나 증가하는 경우 설치할 수 있다.', ox: false, what: ['T'], keywords: ['의무지출'], stamp: ['T'] }
        ],
        answer: 1,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['특별회계', '예산총계주의', '양곡관리', '조달특별회계']
    },
    {
        id: 9123,
        year: 2025,
        exam: '국가직',
        chapter: 'CH01',
        topic: '행태론적 접근방법',
        importance: 'A',
        question: '행태론적 접근방법에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '사회현상에 대한 분석도 자연과학과 마찬가지로 엄밀한 과학적 연구가 가능하다고 본다.', ox: true, what: ['H'], keywords: ['과학적 연구', '자연과학'], stamp: ['H'] },
            { num: 2, text: '자료의 계량적 분석을 특징으로 한다.', ox: true, what: ['H'], keywords: ['계량적 분석'], stamp: ['H'] },
            { num: 3, text: '행태의 규칙성, 상관성 및 인과성을 경험적으로 입증하고 설명할 수 있다고 본다.', ox: true, what: ['H'], keywords: ['규칙성', '인과성', '경험적 입증'], stamp: ['H'] },
            { num: 4, text: '가치와 사실의 분리를 통해 급박한 정책문제 해결을 위한 역할을 하고 학문의 실천적 성격을 회복하였다.', ox: false, what: ['A', 'T'], keywords: ['행태론', '가치 사실 분리', '실천적 성격'], stamp: ['A', 'T'] }
        ],
        answer: 4,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['행태론', '계량적 분석', '가치 사실 분리', '경험적 입증']
    },
    {
        id: 9124,
        year: 2025,
        exam: '국가직',
        chapter: 'CH07',
        topic: '행정통제',
        importance: 'A',
        question: '행정통제에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '정당은 공식적 통제 기능을 수행한다.', ox: false, what: ['A', 'T'], keywords: ['정당', '공식적 통제'], stamp: ['A', 'T'] },
            { num: 2, text: '감사원의 회계 검사는 내부통제 방식이다.', ox: true, what: ['H'], keywords: ['감사원', '내부통제'], stamp: ['H'] },
            { num: 3, text: '통제상황에 맞는 통제과정의 신축성이 필요하다.', ox: true, what: ['H'], keywords: ['통제과정', '신축성'], stamp: ['H'] },
            { num: 4, text: '통제는 책임 이행을 보장하려는 활동이다.', ox: true, what: ['H'], keywords: ['책임 이행'], stamp: ['H'] }
        ],
        answer: 1,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['행정통제', '정당', '감사원', '내부통제', '외부통제']
    },
    {
        id: 9125,
        year: 2025,
        exam: '국가직',
        chapter: 'CH05',
        topic: '정책학(라스웰 특성)',
        importance: 'A',
        question: '라스웰(Lasswell)이 주장한 정책학의 특성에 해당하지 않는 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '합법성(legitimacy)', ox: false, what: ['T'], keywords: ['합법성'], stamp: ['T'] },
            { num: 2, text: '맥락성(contextuality)', ox: true, what: ['W'], keywords: ['맥락성', '라스웰'], stamp: ['W'] },
            { num: 3, text: '방법의 다양성(diversity)', ox: true, what: ['W'], keywords: ['방법의 다양성'], stamp: ['W'] },
            { num: 4, text: '문제지향성(problem-orientation)', ox: true, what: ['W'], keywords: ['문제지향성'], stamp: ['W'] }
        ],
        answer: 1,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['라스웰', '정책학', '맥락성', '방법의 다양성', '문제지향성', '합법성']
    },
    {
        id: 9126,
        year: 2025,
        exam: '국가직',
        chapter: 'CH02',
        topic: '애드호크라시(adhocracy)',
        importance: 'A',
        question: '애드호크라시(adhocracy)의 특성으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '형식주의나 공식성에 얽매이지 않는다.', ox: true, what: ['H'], keywords: ['비형식적', '비공식성'], stamp: ['H'] },
            { num: 2, text: '수평적 분화가 낮고 수직적 분화가 높다.', ox: false, what: ['A', 'T'], keywords: ['수평적 분화', '수직적 분화', '애드호크라시'], stamp: ['A', 'T'] },
            { num: 3, text: '업무 수행 상황에 대한 탄력적 대응을 강조하기 때문에 규칙을 최소화한다.', ox: true, what: ['H'], keywords: ['탄력적 대응', '규칙 최소화'], stamp: ['H'] },
            { num: 4, text: '상황에 대한 신속한 대응을 강조하기 때문에 문제해결의 전문성을 가진 사람이 참여한다.', ox: true, what: ['H'], keywords: ['신속한 대응', '전문성'], stamp: ['H'] }
        ],
        answer: 2,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['애드호크라시', '수평적 분화', '수직적 분화', '탄력적 대응']
    },
    {
        id: 9127,
        year: 2025,
        exam: '국가직',
        chapter: 'CH05',
        topic: '정책결정모형 짝짓기',
        importance: 'S',
        question: '정책결정 모형과 그 특징이 바르게 짝지어진 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '최적모형: 각 대안의 비용과 편익 계산 + 근본적·세부적 결정 구분', ox: false, what: ['T'], keywords: ['최적모형'], stamp: ['T'] },
            { num: 2, text: '합리모형: 모든 비용과 편익 계산 + 가치·목적의 서열화', ox: true, what: ['H'], keywords: ['합리모형', '비용편익', '서열화'], stamp: ['H'] },
            { num: 3, text: '만족모형: 근본적·세부적 결정 구분 + 제한된 합리성', ox: false, what: ['A'], keywords: ['만족모형'], stamp: ['A'] },
            { num: 4, text: '회사모형: 제한된 합리성 + 가치·목적의 서열화', ox: false, what: ['A'], keywords: ['회사모형'], stamp: ['A'] }
        ],
        answer: 2,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['합리모형', '최적모형', '만족모형', '회사모형']
    },
    {
        id: 9128,
        year: 2025,
        exam: '국가직',
        chapter: 'CH09',
        topic: '규제관리제도',
        importance: 'A',
        question: '규제관리제도에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '규제등록제는 정부가 관리대상 규제를 등록하는 방법이다.', ox: true, what: ['H'], keywords: ['규제등록제'], stamp: ['H'] },
            { num: 2, text: '규제유예제는 규제의 효력을 한시적으로 중지해 규제 적용을 유예하는 방법이다.', ox: true, what: ['H'], keywords: ['규제유예제'], stamp: ['H'] },
            { num: 3, text: '규제일몰제는 규제의 존속기간을 정해 기존 규제의 타당성을 주기적으로 관리하는 방법이다.', ox: true, what: ['H'], keywords: ['규제일몰제'], stamp: ['H'] },
            { num: 4, text: '규제비용관리제는 규제의 총량을 정하고 규제의 건수가 그 이하로 감소하지 않도록 관리하는 방법이다.', ox: false, what: ['A', 'T'], keywords: ['규제비용관리제', '규제총량'], stamp: ['A', 'T'] }
        ],
        answer: 4,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['규제등록제', '규제유예제', '규제일몰제', '규제비용관리제']
    },
    {
        id: 9129,
        year: 2025,
        exam: '국가직',
        chapter: 'CH04',
        topic: '기금제도',
        importance: 'A',
        question: '기금제도에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '국가가 특정한 목적을 위하여 특정한 자금을 신축적으로 운용할 필요가 있을 때 설치한다.', ox: true, what: ['H'], keywords: ['기금', '신축적 운용'], stamp: ['H'] },
            { num: 2, text: '예산과 마찬가지로 국회의 심의·의결을 받는다.', ox: true, what: ['H'], keywords: ['국회 심의·의결'], stamp: ['H'] },
            { num: 3, text: '국가재정법상 세입세출예산에 의하지 아니하고 운용할 수 없도록 하고 있다.', ox: false, what: ['A', 'T'], keywords: ['세입세출예산', '기금 운용'], stamp: ['A', 'T'] },
            { num: 4, text: '기금운용계획안을 제출할 때 기금의 성과계획서 및 성과보고서를 함께 제출하여야 한다.', ox: true, what: ['H'], keywords: ['성과계획서', '기금운용계획안'], stamp: ['H'] }
        ],
        answer: 3,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['기금', '신축적 운용', '세입세출예산', '국회 심의·의결']
    },
    {
        id: 9130,
        year: 2025,
        exam: '국가직',
        chapter: 'CH01',
        topic: '학자 매칭(마리니·굿노·덴하르트)',
        importance: 'S',
        question: '학자에 대한 설명으로 옳은 것만을 모두 고른 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '마리니(Marini): 사회적 형평성 강조 / 굿노(Goodnow): 정치와 행정의 유사성 강조', ox: false, what: ['W'], keywords: ['마리니', '굿노'], stamp: ['W'] },
            { num: 2, text: '마리니(Marini): 사회적 형평성 강조 / 덴하르트(Denhardt): 봉사하기 강조', ox: false, what: ['W'], keywords: ['마리니', '덴하르트'], stamp: ['W'] },
            { num: 3, text: '덴하르트(Denhardt): 봉사하기 강조 / 코헨·올슨: 쓰레기통 모형', ox: true, what: ['W'], keywords: ['덴하르트', '봉사', '코헨', '올슨', '쓰레기통'], stamp: ['W'] },
            { num: 4, text: '굿노(Goodnow): 정치행정이원론 / 코헨·올슨: 합리모형', ox: false, what: ['W', 'T'], keywords: ['굿노', '정치행정이원론', '합리모형'], stamp: ['W', 'T'] }
        ],
        answer: 3,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['마리니', '굿노', '덴하르트', '코헨', '올슨', '정치행정이원론']
    },
    {
        id: 9131,
        year: 2025,
        exam: '국가직',
        chapter: 'CH05',
        topic: '정책집행(순응과 불응)',
        importance: 'A',
        question: '정책집행과정에서 순응과 불응에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '정책집행을 담당하는 일선 관료도 순응의 대상이다.', ox: true, what: ['H'], keywords: ['일선 관료', '순응'], stamp: ['H'] },
            { num: 2, text: '정책대상집단의 경제적 부담은 불응을 초래하기 쉽다.', ox: true, what: ['H'], keywords: ['경제적 부담', '불응'], stamp: ['H'] },
            { num: 3, text: '정책의 내용에 대한 긍정적 판단은 순응을 유도하는 요인이다.', ox: true, what: ['H'], keywords: ['긍정적 판단', '순응 유도'], stamp: ['H'] },
            { num: 4, text: '던칸(Duncan)은 정책대상집단의 내면적 가치관의 변화를 순응에 포함한다.', ox: false, what: ['W', 'T'], keywords: ['던칸', '내면적 가치관', '순응'], stamp: ['W', 'T'] }
        ],
        answer: 4,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['순응', '불응', '일선 관료', '던칸', '정책대상집단']
    },
    {
        id: 9132,
        year: 2025,
        exam: '국가직',
        chapter: 'CH02',
        topic: '파킨슨 법칙',
        importance: 'A',
        question: '파킨슨(C. Parkinson) 법칙에 해당하는 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '본질적인 업무는 그대로인데, 파생적인 업무가 늘어난다.', ox: true, what: ['H'], keywords: ['파생적 업무'], stamp: ['H'] },
            { num: 2, text: '공무원은 금전적 효용보다는 직무에 관련한 개인적 효용을 추구한다.', ox: false, what: ['A'], keywords: ['개인적 효용', '다운스'], stamp: ['A'] },
            { num: 3, text: '자신의 무능력 수준에 이를 때까지 승진하게 된다.', ox: false, what: ['A'], keywords: ['피터 원리'], stamp: ['A'] },
            { num: 4, text: '공무원의 수는 업무량과 관계없이 증가한다.', ox: true, what: ['H'], keywords: ['파킨슨 법칙', '업무량 무관', '공무원 수 증가'], stamp: ['H'] }
        ],
        answer: 4,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['파킨슨 법칙', '피터 원리', '파생적 업무', '업무량 무관']
    },
    {
        id: 9133,
        year: 2025,
        exam: '국가직',
        chapter: 'CH01',
        topic: '보몰효과(Baumol effect)',
        importance: 'A',
        question: '정부지출 증가를 설명하는 이론 중 보몰효과(Baumol effect)에 해당하는 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '정부 부문은 저자본 노동집약적 서비스 산업이어서 민간 부문에 비해 생산성이 낮고, 임금 인상이 정부지출을 증가시킨다.', ox: true, what: ['H'], keywords: ['보몰효과', '노동집약적', '생산성', '임금상승'], stamp: ['H'] },
            { num: 2, text: '위기 시 정부지출이 급증한 후 이전 수준으로 완전히 돌아가지 않는다.', ox: false, what: ['A'], keywords: ['전위효과'], stamp: ['A'] },
            { num: 3, text: '산업화가 진행될수록 국가활동과 재정규모가 확대된다.', ox: false, what: ['A'], keywords: ['바그너 법칙'], stamp: ['A'] },
            { num: 4, text: '나쁜 화폐가 좋은 화폐를 시장에서 구축한다.', ox: false, what: ['A'], keywords: ['그레셤 법칙'], stamp: ['A'] }
        ],
        answer: 1,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['보몰효과', '전위효과', '바그너 법칙', '그레셤 법칙']
    },
    {
        id: 9134,
        year: 2025,
        exam: '국가직',
        chapter: 'CH08',
        topic: '데이터 3법',
        importance: 'S',
        question: '데이터 3법에 속하지 않는 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '개인정보 보호법', ox: true, what: ['H'], keywords: ['개인정보 보호법'], stamp: ['H'] },
            { num: 2, text: '신용정보의 이용 및 보호에 관한 법률', ox: true, what: ['H'], keywords: ['신용정보법'], stamp: ['H'] },
            { num: 3, text: '데이터 산업진흥 및 이용촉진에 관한 기본법', ox: false, what: ['T'], keywords: ['데이터산업진흥법'], stamp: ['T'] },
            { num: 4, text: '정보통신망 이용촉진 및 정보보호 등에 관한 법률', ox: true, what: ['H'], keywords: ['정보통신망법'], stamp: ['H'] }
        ],
        answer: 3,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['데이터 3법', '개인정보 보호법', '신용정보법', '정보통신망법']
    },
    {
        id: 9135,
        year: 2025,
        exam: '국가직',
        chapter: 'CH03',
        topic: '순환보직',
        importance: 'A',
        question: '순환보직에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '배치전환이라고도 하며 외부임용 중 하나이다.', ox: false, what: ['A', 'T'], keywords: ['순환보직', '외부임용', '내부임용'], stamp: ['A', 'T'] },
            { num: 2, text: '기관이 수행하는 다양한 업무에 대한 이해를 가능하게 한다.', ox: true, what: ['H'], keywords: ['다양한 업무', '이해'], stamp: ['H'] },
            { num: 3, text: '특정 분야에서 전문성 축적을 어렵게 한다.', ox: true, what: ['H'], keywords: ['전문성 축적', '어려움'], stamp: ['H'] },
            { num: 4, text: '조직단위에서 새로운 아이디어의 유입을 기대할 수 있다.', ox: true, what: ['H'], keywords: ['새로운 아이디어'], stamp: ['H'] }
        ],
        answer: 1,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['순환보직', '배치전환', '내부임용', '전문성']
    },
    {
        id: 9136,
        year: 2025,
        exam: '국가직',
        chapter: 'CH03',
        topic: '시보임용',
        importance: 'S',
        question: '시보임용에 대한 설명으로 옳은 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '5급 이상 모든 공무원은 1년의 시보임용 기간을 거친다.', ox: false, what: ['T'], keywords: ['5급 이상', '1년'], stamp: ['T'] },
            { num: 2, text: '시보임용 기간 중에 있는 공무원은 훈련을 받는 기간 동안 봉급이 지급되지 않는다.', ox: false, what: ['A'], keywords: ['봉급 미지급'], stamp: ['A'] },
            { num: 3, text: '임용권자는 시보임용 기간 중에 품위를 크게 손상하는 행위를 한 경우 시보 공무원을 면직시킬 수 있다.', ox: true, what: ['H'], keywords: ['시보', '면직', '품위 손상'], stamp: ['H'] },
            { num: 4, text: '6급 이하 임기제 공무원의 시보임용 기간은 6개월이다.', ox: false, what: ['T'], keywords: ['임기제', '시보', '6개월'], stamp: ['T'] }
        ],
        answer: 3,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['시보임용', '5급', '6급', '면직', '임기제']
    },
    {
        id: 9137,
        year: 2025,
        exam: '국가직',
        chapter: 'CH05',
        topic: '정책델파이 기법',
        importance: 'B',
        question: '정책델파이(policy delphi) 기법에 대한 설명으로 옳은 것은?',
        type: 'positive',
        choices: [
            { num: 1, text: '참여자의 주관적 판단에 의존하기 때문에 통계 수치를 활용하지 않는다.', ox: false, what: ['A'], keywords: ['통계 미활용'], stamp: ['A'] },
            { num: 2, text: '참여자들의 익명성을 철저히 보장하여 의견의 자유로운 표현을 유도한다.', ox: false, what: ['A'], keywords: ['익명성', '정책델파이'], stamp: ['A'] },
            { num: 3, text: '참여자들은 전문성 자체보다 다양한 이해관계와 식견을 가진 인물 중심으로 구성된다.', ox: true, what: ['H'], keywords: ['다양한 이해관계', '식견'], stamp: ['H'] },
            { num: 4, text: '참여자 간 갈등을 최대한 억제하며 합의된 의견의 도출을 지향한다.', ox: false, what: ['A'], keywords: ['갈등 억제', '합의'], stamp: ['A'] }
        ],
        answer: 3,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['정책델파이', '익명성', '다양한 이해관계', '갈등']
    },
    {
        id: 9138,
        year: 2025,
        exam: '국가직',
        chapter: 'CH04',
        topic: '조세지출(tax expenditure)',
        importance: 'A',
        question: '조세지출에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '우리나라에서는 지출 항목별 평가 등을 통해 국회의 심의와 의결을 받고 있다.', ox: false, what: ['A', 'T'], keywords: ['조세지출', '국회 심의'], stamp: ['A', 'T'] },
            { num: 2, text: '세법상의 비과세, 감면, 공제 등 다양한 형태로 이루어진다.', ox: true, what: ['H'], keywords: ['비과세', '감면', '공제'], stamp: ['H'] },
            { num: 3, text: '정부가 실제로 지출하지 않고도 지출과 유사한 효과를 얻을 수 있다.', ox: true, what: ['H'], keywords: ['간접 지출', '유사 효과'], stamp: ['H'] },
            { num: 4, text: '감추어진 보조금(hidden subsidies)이라고도 한다.', ox: true, what: ['H'], keywords: ['감추어진 보조금'], stamp: ['H'] }
        ],
        answer: 1,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['조세지출', '비과세', '감면', '감추어진 보조금']
    },
    {
        id: 9139,
        year: 2025,
        exam: '국가직',
        chapter: 'CH01',
        topic: '준정부기관',
        importance: 'A',
        question: '준정부기관에 대한 설명으로 옳지 않은 것은?',
        type: 'negative',
        choices: [
            { num: 1, text: '시장성과 기업성이 강한 업무를 수행함으로써 정부에 재정적으로 의존하지 않는다.', ox: false, what: ['A', 'T'], keywords: ['준정부기관', '시장성', '재정적 불의존'], stamp: ['A', 'T'] },
            { num: 2, text: '공무원연금공단, 한국연구재단, 국립생태원 등이 있다.', ox: true, what: ['H'], keywords: ['공무원연금공단', '한국연구재단'], stamp: ['H'] },
            { num: 3, text: '준정부기관의 장은 임원추천위원회가 복수로 추천한 사람 중에서 주무기관의 장이 임명한다.', ox: true, what: ['H'], keywords: ['임원추천위원회'], stamp: ['H'] },
            { num: 4, text: '정부조직이 아니면서 정부로부터 권한을 위임받아 공공서비스를 전달한다.', ox: true, what: ['H'], keywords: ['권한 위임', '공공서비스'], stamp: ['H'] }
        ],
        answer: 1,
        subject: '행정학',
        sourceCategory: '25년 7급 기출 선별(9급 빈출)',
        keywords: ['준정부기관', '공무원연금공단', '임원추천위원회', '공공서비스']
    }
];

(function normalizeSupplementQuestions() {
    ADMIN_QUESTIONS_SUPPLEMENT.forEach(q => {
        q.choices.forEach(c => {
            c.what = c.what || ['H'];
            c.stamp = c.stamp || c.what;
            c.keywords = c.keywords || [];
        });
        q.keywords = q.keywords || [...new Set(q.choices.flatMap(c => c.keywords || []))];
    });
})();
