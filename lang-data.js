// 국어·영어 압축 인출 앱 기본 데이터
const LANG_EXAM_DATE = '2026-04-05';

const LANG_SUBJECTS = {
  kor: '국어',
  eng: '영어'
};

const LANG_CHAPTERS = {
  K01: '국어 문법·형태론',
  K02: '국어 규범·표현',
  K03: '국어 독해·주제',
  K04: '국어 논리·추론',
  K05: '국어 화법·작문·자료',
  E01: '영어 문법',
  E02: '영어 어휘',
  E03: '영어 독해',
  E04: '영어 순서·삽입·무관문',
  E05: '영어 대화·실용'
};

const LANG_WEAK_TAGS = {
  kor: [
    { id: 'grammar', label: '문법·형태소' },
    { id: 'logic', label: '논리·추론' },
    { id: 'reading', label: '독해근거' },
    { id: 'time', label: '시간압박' },
    { id: 'careless', label: '실수' }
  ],
  eng: [
    { id: 'grammar', label: '문법' },
    { id: 'vocab', label: '어휘' },
    { id: 'order', label: '순서·삽입' },
    { id: 'reading', label: '독해근거' },
    { id: 'time', label: '시간압박' },
    { id: 'careless', label: '실수' }
  ]
};

// 수동 검증 완료 문항을 여기에 직접 추가 가능
const LANG_QUESTIONS = [];
