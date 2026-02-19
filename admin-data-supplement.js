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
