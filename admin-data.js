// 행정학 모드 데이터 (국가직 9급 중심 선별)
const ADMIN_EXAM_DATE = "2026-04-05";

const ADMIN_WHAT_CARDS = [
    {
        "id": "W1",
        "type": "W",
        "title": "학자 확인 (Who)",
        "rule": "이 주장을 한 학자는 누구인가?",
        "tip": "🔍 학자-키워드 쌍을 정확히 매칭!",
        "trap": "학자 바꿔치기 함정 최빈출"
    },
    {
        "id": "W2",
        "type": "H",
        "title": "분류기준 확인 (How)",
        "rule": "무엇을 기준으로 분류했는가?",
        "tip": "📊 분류기준이 핵심! Lowi vs Wilson vs Salisbury",
        "trap": "분류기준 혼동 함정"
    },
    {
        "id": "W3",
        "type": "A",
        "title": "반대이론 확인 (Against)",
        "rule": "이 이론과 반대되는 이론은?",
        "tip": "⚔️ 유사 이론의 차이점을 정확히 변별!",
        "trap": "이론 특성 뒤섞기 함정"
    },
    {
        "id": "W4",
        "type": "T",
        "title": "함정 확인 (Trap)",
        "rule": "이 선지에서 바꿔치기한 것은?",
        "tip": "🎯 숫자·장단점·시점 바꿔치기 주의!",
        "trap": "제도 숫자·장단점 역전"
    }
];

const ADMIN_TRAP_PATTERNS = [
    {
        "id": "T1",
        "name": "학자 바꿔치기",
        "desc": "오스트롬→니스카넨, Burns→Bass 등 학자명 교체",
        "freq": "최빈출"
    },
    {
        "id": "T2",
        "name": "이론 특성 뒤섞기",
        "desc": "합리모형 특성을 점증모형에 부여",
        "freq": "최빈출"
    },
    {
        "id": "T3",
        "name": "제도 숫자 혼동",
        "desc": "시보기간, 제소기간 등 숫자 교체",
        "freq": "고빈출"
    },
    {
        "id": "T4",
        "name": "분류기준 혼동",
        "desc": "Lowi(강제성) vs Wilson(비용편익) 기준 교체",
        "freq": "고빈출"
    },
    {
        "id": "T5",
        "name": "장단점 역전",
        "desc": "위원회 조직 책임성을 높인다→낮춘다",
        "freq": "고빈출"
    },
    {
        "id": "T6",
        "name": "법률명 바꿔치기",
        "desc": "데이터3법 구성 법률 교체",
        "freq": "중빈출"
    },
    {
        "id": "T7",
        "name": "시점 혼동",
        "desc": "사전평가↔사후평가 시점 교체",
        "freq": "중빈출"
    }
];

const ADMIN_CHAPTERS = {
    "CH01": "행정학 총론",
    "CH02": "조직이론",
    "CH03": "인사행정",
    "CH04": "재무행정",
    "CH05": "정책학",
    "CH06": "지방자치",
    "CH07": "행정통제·윤리",
    "CH08": "전자정부·정보화",
    "CH09": "행정개혁"
};

const ADMIN_QUESTIONS = [
    {
        "id": 1001,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH01",
        "topic": "NPM vs 거버넌스 vs NPS",
        "importance": "S",
        "question": "신공공관리론(NPM)에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "시장원리와 경쟁 메커니즘을 공공부문에 도입하여 효율성을 추구한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "시장원리",
                    "경쟁",
                    "효율성"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "국민을 공공서비스의 고객으로 인식하고 고객 만족을 강조한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "고객",
                    "고객만족"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "정부의 역할을 방향잡기(steering)보다 노젓기(rowing)에 중점을 둔다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "방향잡기",
                    "노젓기"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "성과 중심의 관리와 민간위탁 등 기업가적 정부를 지향한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "성과중심",
                    "민간위탁",
                    "기업가적정부"
                ],
                "stamp": [
                    "H"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "시장원리",
            "경쟁",
            "효율성",
            "고객",
            "고객만족",
            "방향잡기",
            "노젓기",
            "성과중심",
            "민간위탁",
            "기업가적정부"
        ]
    },
    {
        "id": 1002,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH01",
        "topic": "NPM vs 거버넌스 vs NPS",
        "importance": "S",
        "question": "신공공서비스론(NPS)에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "공무원의 역할은 기업가적 행동으로 효율성을 극대화하는 것이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "기업가적",
                    "효율성"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "정부의 역할은 시장에서의 경쟁을 촉진하는 촉매자이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "시장",
                    "경쟁",
                    "촉매자"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "국민을 고객이 아닌 시민으로 보고 민주적 시민정신을 강조한다.",
                "ox": true,
                "what": [
                    "H",
                    "A"
                ],
                "keywords": [
                    "시민",
                    "민주적",
                    "시민정신"
                ],
                "stamp": [
                    "H",
                    "A"
                ]
            },
            {
                "num": 4,
                "text": "공익은 개인 이익의 총합으로 정의된다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "공익",
                    "개인이익총합"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "기업가적",
            "효율성",
            "시장",
            "경쟁",
            "촉매자",
            "시민",
            "민주적",
            "시민정신",
            "공익",
            "개인이익총합"
        ]
    },
    {
        "id": 1003,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH01",
        "topic": "시장실패와 정부실패",
        "importance": "S",
        "question": "시장실패의 원인으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "공공재의 존재",
                "ox": true,
                "what": [],
                "keywords": [
                    "공공재"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "외부효과의 발생",
                "ox": true,
                "what": [],
                "keywords": [
                    "외부효과"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "비용과 편익의 절연",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "비용편익절연"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "정보의 비대칭성",
                "ox": true,
                "what": [],
                "keywords": [
                    "정보비대칭"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "공공재",
            "외부효과",
            "비용편익절연",
            "정보비대칭"
        ]
    },
    {
        "id": 1004,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH01",
        "topic": "정부실패",
        "importance": "S",
        "question": "정부실패의 원인에 해당하지 않는 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "내부성(internalities)의 발생",
                "ox": true,
                "what": [],
                "keywords": [
                    "내부성"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "X-비효율성",
                "ox": true,
                "what": [],
                "keywords": [
                    "X-비효율"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "자연독점",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "자연독점"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "파생적 외부효과",
                "ox": true,
                "what": [],
                "keywords": [
                    "파생적외부효과"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "내부성",
            "X-비효율",
            "자연독점",
            "파생적외부효과"
        ]
    },
    {
        "id": 1005,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH01",
        "topic": "행정이론 발달",
        "importance": "S",
        "question": "정치행정이원론에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "행정은 정치와 불가분의 관계에 있으며, 정책결정 기능도 수행한다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "정치행정일원론"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 2,
                "text": "행정의 정치적 성격을 인정하고 행정의 적극적 역할을 강조한다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "적극적역할"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 3,
                "text": "정치는 국가의지의 표현이고 행정은 국가의지의 집행이라고 본다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "국가의지표현",
                    "국가의지집행"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "뉴딜 정책 이후 행정국가 현상을 설명하기 위해 등장하였다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "뉴딜",
                    "행정국가"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "정치행정일원론",
            "적극적역할",
            "국가의지표현",
            "국가의지집행",
            "뉴딜",
            "행정국가"
        ]
    },
    {
        "id": 1006,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH01",
        "topic": "공공선택이론",
        "importance": "S",
        "question": "공공선택이론에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "방법론적 개인주의를 채택한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "방법론적개인주의"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "인간은 자기 이익을 극대화하는 합리적 존재로 가정한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "합리적",
                    "이익극대화"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "정부 관료제의 독점적 서비스 공급을 옹호한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "독점적공급",
                    "옹호"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "공공부문에 시장경제 원리를 도입하는 것을 강조한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "시장경제원리"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "방법론적개인주의",
            "합리적",
            "이익극대화",
            "독점적공급",
            "옹호",
            "시장경제원리"
        ]
    },
    {
        "id": 1007,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH01",
        "topic": "상황적응적 접근방법",
        "importance": "A",
        "question": "상황적응적 접근방법(contingency approach)에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "모든 상황에 적용 가능한 유일최선의 관리방법이 존재한다고 본다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "유일최선",
                    "보편적"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "조직을 환경과 상호작용하는 개방체제로 파악한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "개방체제"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "효율적인 조직구조는 환경적 상황에 의존한다고 본다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "환경적상황"
                ],
                "stamp": []
            },
            {
                "num": 4,
                "text": "거시적인 거대이론보다는 중범위이론을 지향한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "중범위이론"
                ],
                "stamp": []
            }
        ],
        "answer": 1,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "유일최선",
            "보편적",
            "개방체제",
            "환경적상황",
            "중범위이론"
        ]
    },
    {
        "id": 1008,
        "year": 2025,
        "exam": "국회8급",
        "chapter": "CH01",
        "topic": "사회적 자본",
        "importance": "A",
        "question": "사회적 자본에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "사회적 자본에는 거래비용을 감소시키는 순기능이 있다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "거래비용감소"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "사회적 자본은 사용할수록 증가하는 특성이 있다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "사용증가"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "사회적 자본은 정부에 의해 단기간에 형성될 수 있다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "단기간형성"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "사회적 자본의 요소에는 신뢰, 규범, 네트워크 등이 포함된다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "신뢰",
                    "규범",
                    "네트워크"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "보조기출 선별",
        "keywords": [
            "거래비용감소",
            "사용증가",
            "단기간형성",
            "신뢰",
            "규범",
            "네트워크"
        ]
    },
    {
        "id": 1009,
        "year": 2022,
        "exam": "국가직",
        "chapter": "CH01",
        "topic": "행정가치",
        "importance": "A",
        "question": "행정의 본질적 가치에 해당하지 않는 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "정의(justice)",
                "ox": true,
                "what": [],
                "keywords": [
                    "정의"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "형평성(equity)",
                "ox": true,
                "what": [],
                "keywords": [
                    "형평성"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "능률성(efficiency)",
                "ox": false,
                "what": [
                    "H",
                    "T"
                ],
                "keywords": [
                    "능률성"
                ],
                "stamp": [
                    "H",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "자유(liberty)",
                "ox": true,
                "what": [],
                "keywords": [
                    "자유"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "정의",
            "형평성",
            "능률성",
            "자유"
        ]
    },
    {
        "id": 1010,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH01",
        "topic": "롤스의 정의론",
        "importance": "B",
        "question": "롤스(J. Rawls)의 정의론에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "사회계약론적 전통에 기초하고 있다.",
                "ox": true,
                "what": [
                    "W"
                ],
                "keywords": [
                    "사회계약론"
                ],
                "stamp": [
                    "W"
                ]
            },
            {
                "num": 2,
                "text": "공리주의적 효용을 정의의 기초로 삼는다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "공리주의",
                    "효용"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "최소수혜자에게 유리한 불평등은 정의롭다고 본다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "최소수혜자",
                    "차등원칙"
                ],
                "stamp": []
            },
            {
                "num": 4,
                "text": "무지의 베일(veil of ignorance) 개념을 사용한다.",
                "ox": true,
                "what": [
                    "W"
                ],
                "keywords": [
                    "무지의베일"
                ],
                "stamp": [
                    "W"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "사회계약론",
            "공리주의",
            "효용",
            "최소수혜자",
            "차등원칙",
            "무지의베일"
        ]
    },
    {
        "id": 1011,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH01",
        "topic": "거버넌스",
        "importance": "S",
        "question": "뉴거버넌스(New Governance)에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "정부, 시민사회, 시장 간의 네트워크와 협력을 강조한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "네트워크",
                    "협력"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "정부의 일방적 통치가 아닌 협치(co-governance)를 지향한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "협치"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "시장 메커니즘과 경쟁을 통한 효율성 극대화를 최우선으로 한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "시장",
                    "경쟁",
                    "효율성"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "다양한 이해관계자의 참여와 상호작용을 중시한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "참여",
                    "상호작용"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "네트워크",
            "협력",
            "협치",
            "시장",
            "경쟁",
            "효율성",
            "참여",
            "상호작용"
        ]
    },
    {
        "id": 1012,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH01",
        "topic": "행정이론 발달",
        "importance": "A",
        "question": "신행정론(New Public Administration)에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "능률성과 경제성을 최우선 가치로 추구한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "능률성",
                    "경제성"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "사회적 형평성과 고객 대응성을 강조한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "형평성",
                    "대응성"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "가치중립적 과학적 연구를 지향한다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "가치중립"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 4,
                "text": "정치행정이원론에 입각하여 행정의 집행 기능을 강조한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "이원론"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "능률성",
            "경제성",
            "형평성",
            "대응성",
            "가치중립",
            "이원론"
        ]
    },
    {
        "id": 1013,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH01",
        "topic": "행정가치",
        "importance": "S",
        "question": "형평성(equity)의 의미로 가장 적절한 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "최소의 비용으로 최대의 산출을 달성하는 것이다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "능률성"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 2,
                "text": "설정된 목표를 달성하는 정도를 의미한다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "효과성"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 3,
                "text": "사회적 약자에게 더 많은 혜택을 배분하는 것이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "사회적약자",
                    "혜택배분"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "법령에 따라 행정을 수행하는 것이다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "합법성"
                ],
                "stamp": [
                    "A"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "능률성",
            "효과성",
            "사회적약자",
            "혜택배분",
            "합법성"
        ]
    },
    {
        "id": 1014,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH01",
        "topic": "학자-이론 매칭",
        "importance": "S",
        "question": "학자와 이론의 연결이 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "Wilson(행정학) - 정치행정이원론",
                "ox": true,
                "what": [
                    "W"
                ],
                "keywords": [
                    "Wilson",
                    "이원론"
                ],
                "stamp": [
                    "W"
                ]
            },
            {
                "num": 2,
                "text": "Simon - 제한된 합리성(bounded rationality)",
                "ox": true,
                "what": [
                    "W"
                ],
                "keywords": [
                    "Simon",
                    "제한된합리성"
                ],
                "stamp": [
                    "W"
                ]
            },
            {
                "num": 3,
                "text": "Waldo - 신공공관리론(NPM)",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "Waldo",
                    "NPM"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "Denhardt - 신공공서비스론(NPS)",
                "ox": true,
                "what": [
                    "W"
                ],
                "keywords": [
                    "Denhardt",
                    "NPS"
                ],
                "stamp": [
                    "W"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "Wilson",
            "이원론",
            "Simon",
            "제한된합리성",
            "Waldo",
            "NPM",
            "Denhardt",
            "NPS"
        ]
    },
    {
        "id": 1015,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH01",
        "topic": "NPM vs 거버넌스",
        "importance": "S",
        "question": "NPM과 뉴거버넌스 비교로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "NPM은 경쟁과 시장원리를, 뉴거버넌스는 협력과 네트워크를 강조한다.",
                "ox": true,
                "what": [
                    "A"
                ],
                "keywords": [
                    "경쟁vs협력"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 2,
                "text": "NPM은 고객 중심을, 뉴거버넌스는 시민 중심을 지향한다.",
                "ox": true,
                "what": [
                    "A"
                ],
                "keywords": [
                    "고객vs시민"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 3,
                "text": "NPM과 뉴거버넌스 모두 정부의 독점적 역할을 강조한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "독점적역할"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "NPM은 산출과 성과를, 뉴거버넌스는 과정과 참여를 중시한다.",
                "ox": true,
                "what": [
                    "A"
                ],
                "keywords": [
                    "산출vs과정"
                ],
                "stamp": [
                    "A"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "경쟁vs협력",
            "고객vs시민",
            "독점적역할",
            "산출vs과정"
        ]
    },
    {
        "id": 1016,
        "year": 2022,
        "exam": "국가직",
        "chapter": "CH01",
        "topic": "행정이론",
        "importance": "A",
        "question": "행정학의 주요 접근방법과 그 특성의 연결이 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "생태론적 접근 - 행정과 환경과의 상호작용을 강조",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "생태론",
                    "환경"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "체제론적 접근 - 투입→전환→산출→환류의 과정을 분석",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "체제론",
                    "환류"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "공공선택론 - 집단적 의사결정과 사회적 합의를 강조",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "집단적",
                    "사회적합의"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "현상학적 접근 - 행위자의 주관적 의미와 해석을 중시",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "주관적",
                    "해석"
                ],
                "stamp": [
                    "H"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "생태론",
            "환경",
            "체제론",
            "환류",
            "집단적",
            "사회적합의",
            "주관적",
            "해석"
        ]
    },
    {
        "id": 2001,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "리더십이론",
        "importance": "S",
        "question": "변혁적 리더십에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "Burns가 처음 제시하고 Bass가 발전시켰다.",
                "ox": true,
                "what": [
                    "W"
                ],
                "keywords": [
                    "Burns",
                    "Bass"
                ],
                "stamp": [
                    "W"
                ]
            },
            {
                "num": 2,
                "text": "카리스마, 지적 자극, 개별적 배려 등이 핵심 구성요소이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "카리스마",
                    "지적자극",
                    "개별적배려"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "보상과 처벌의 교환관계를 기반으로 한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "보상",
                    "처벌",
                    "교환"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "부하의 높은 차원의 욕구를 자극하여 동기를 부여한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "높은차원욕구"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "Burns",
            "Bass",
            "카리스마",
            "지적자극",
            "개별적배려",
            "보상",
            "처벌",
            "교환",
            "높은차원욕구"
        ]
    },
    {
        "id": 2002,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "관료제",
        "importance": "S",
        "question": "베버(Weber)의 관료제 특성으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "계층제적 구조에 따른 명확한 권한 배분",
                "ox": true,
                "what": [
                    "W"
                ],
                "keywords": [
                    "계층제",
                    "권한배분"
                ],
                "stamp": [
                    "W"
                ]
            },
            {
                "num": 2,
                "text": "규칙과 절차에 의한 업무 수행",
                "ox": true,
                "what": [],
                "keywords": [
                    "규칙",
                    "절차"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "비공식적 인적 관계를 통한 조직 통합",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "비공식적",
                    "인적관계"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "전문적 능력에 기초한 임용과 보상",
                "ox": true,
                "what": [],
                "keywords": [
                    "전문적능력",
                    "실적"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "계층제",
            "권한배분",
            "규칙",
            "절차",
            "비공식적",
            "인적관계",
            "전문적능력",
            "실적"
        ]
    },
    {
        "id": 2003,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "동기부여이론",
        "importance": "S",
        "question": "허즈버그(Herzberg)의 동기-위생이론에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "위생요인이 충족되면 직무만족이 높아진다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "위생요인",
                    "직무만족"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "동기요인에는 보수, 작업조건, 대인관계 등이 포함된다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "보수",
                    "작업조건"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "위생요인의 불충족은 불만족을, 동기요인의 충족은 만족을 가져온다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "위생불만족",
                    "동기만족"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "직무만족과 직무불만족은 하나의 연속선상에 있다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "연속선"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "위생요인",
            "직무만족",
            "보수",
            "작업조건",
            "위생불만족",
            "동기만족",
            "연속선"
        ]
    },
    {
        "id": 2004,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "동기부여이론",
        "importance": "S",
        "question": "매슬로우(Maslow)의 욕구계층이론과 앨더퍼(Alderfer)의 ERG이론에 대한 비교로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "ERG이론은 욕구를 존재·관계·성장의 3단계로 구분한다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "존재",
                    "관계",
                    "성장"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "매슬로우는 하위욕구가 충족되어야 상위욕구가 나타난다고 본다.",
                "ox": true,
                "what": [
                    "W"
                ],
                "keywords": [
                    "하위충족",
                    "상위"
                ],
                "stamp": [
                    "W"
                ]
            },
            {
                "num": 3,
                "text": "ERG이론은 상위욕구 좌절 시 하위욕구로 퇴행할 수 있다고 본다.",
                "ox": true,
                "what": [
                    "W",
                    "A"
                ],
                "keywords": [
                    "좌절",
                    "퇴행"
                ],
                "stamp": [
                    "W",
                    "A"
                ]
            },
            {
                "num": 4,
                "text": "매슬로우는 복수의 욕구가 동시에 작용할 수 있다고 본다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "동시작용"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            }
        ],
        "answer": 4,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "존재",
            "관계",
            "성장",
            "하위충족",
            "상위",
            "좌절",
            "퇴행",
            "동시작용"
        ]
    },
    {
        "id": 2005,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "조직구조",
        "importance": "S",
        "question": "매트릭스 조직에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "기능부서와 프로젝트팀의 이중 구조를 갖는다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "이중구조"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "명령통일의 원칙이 엄격히 준수된다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "명령통일"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "환경 변화에 신속하게 대응할 수 있다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "환경변화",
                    "신속대응"
                ],
                "stamp": []
            },
            {
                "num": 4,
                "text": "조직 구성원이 두 명의 상관에게 보고하는 이중 보고체계이다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "이중보고"
                ],
                "stamp": []
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "이중구조",
            "명령통일",
            "환경변화",
            "신속대응",
            "이중보고"
        ]
    },
    {
        "id": 2006,
        "year": 2022,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "위원회 조직",
        "importance": "A",
        "question": "위원회 조직의 장점으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "다양한 이해관계와 전문지식을 반영할 수 있다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "다양한이해",
                    "전문지식"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "신중한 결정이 가능하다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "신중한결정"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "책임 소재가 명확하여 신속한 결정이 가능하다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "책임명확",
                    "신속"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "독단적 결정을 방지할 수 있다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "독단방지"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "다양한이해",
            "전문지식",
            "신중한결정",
            "책임명확",
            "신속",
            "독단방지"
        ]
    },
    {
        "id": 2007,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "조직구조",
        "importance": "A",
        "question": "기계적 조직과 유기적 조직에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "유기적 조직은 안정적 환경에 적합하다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "안정적환경"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "기계적 조직은 수평적 조정과 팀워크를 강조한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "수평적조정"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "유기적 조직의 대표적 예는 학습조직이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "학습조직"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "기계적 조직은 유연한 규칙 적용을 특징으로 한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "유연한규칙"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "안정적환경",
            "수평적조정",
            "학습조직",
            "유연한규칙"
        ]
    },
    {
        "id": 2008,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "목표관리(MBO)",
        "importance": "A",
        "question": "목표관리(MBO)에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "상하 참여적 목표 설정을 강조한다.",
                "ox": true,
                "what": [
                    "W"
                ],
                "keywords": [
                    "참여적",
                    "목표설정"
                ],
                "stamp": [
                    "W"
                ]
            },
            {
                "num": 2,
                "text": "Drucker가 제시한 관리 기법이다.",
                "ox": true,
                "what": [
                    "W"
                ],
                "keywords": [
                    "Drucker"
                ],
                "stamp": [
                    "W"
                ]
            },
            {
                "num": 3,
                "text": "목표 설정→실행→성과 평가의 순환과정이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "순환과정"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "상급자가 일방적으로 목표를 설정하고 하달한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "일방적",
                    "하달"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 4,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "참여적",
            "목표설정",
            "Drucker",
            "순환과정",
            "일방적",
            "하달"
        ]
    },
    {
        "id": 2009,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "조직문화",
        "importance": "B",
        "question": "조직시민행동(OCB)에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "공식적 직무기술서에 명시된 의무적 행동을 의미한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "의무적"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "Organ이 제시한 개념으로 자발적·재량적 행동이다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "Organ",
                    "자발적",
                    "재량적"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "보상 체계와 직접적으로 연결된 행동이다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "보상연결"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "조직의 공식적 성과평가에 반드시 반영된다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "성과평가반영"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "의무적",
            "Organ",
            "자발적",
            "재량적",
            "보상연결",
            "성과평가반영"
        ]
    },
    {
        "id": 2010,
        "year": 2022,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "애드호크라시",
        "importance": "B",
        "question": "애드호크라시(adhocracy)에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "관료제와 유사하게 표준화된 절차를 중시한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "표준화",
                    "관료제"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "임시적·유기적 조직으로 문제해결 중심의 팀을 운영한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "임시적",
                    "유기적",
                    "문제해결"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "안정적 환경에서 효과적인 조직형태이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "안정적환경"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "계층적 명령체계를 강화하여 효율성을 높인다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "계층적",
                    "명령체계"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "표준화",
            "관료제",
            "임시적",
            "유기적",
            "문제해결",
            "안정적환경",
            "계층적",
            "명령체계"
        ]
    },
    {
        "id": 2011,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "상황적 리더십",
        "importance": "S",
        "question": "허시와 블랜차드(Hersey & Blanchard)의 상황적 리더십이론에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "부하의 성숙도에 따라 리더십 유형을 변경해야 한다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "성숙도",
                    "유형변경"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "리더의 고정된 특성이 조직 성과를 결정한다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "고정특성"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 3,
                "text": "모든 상황에서 변혁적 리더십이 가장 효과적이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "모든상황"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "리더와 부하 간의 경제적 교환관계를 중시한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "경제적교환"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            }
        ],
        "answer": 1,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "성숙도",
            "유형변경",
            "고정특성",
            "모든상황",
            "경제적교환"
        ]
    },
    {
        "id": 2012,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "조직구조",
        "importance": "A",
        "question": "사업구조(divisional structure)의 특징으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "제품이나 지역별로 부서를 편성한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "제품",
                    "지역"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "각 사업부가 독립적으로 운영되어 자율성이 높다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "독립",
                    "자율성"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "조직 전체의 규모의 경제를 극대화하기 용이하다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "규모의경제"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "사업부 간 중복 투자가 발생할 수 있다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "중복투자"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "제품",
            "지역",
            "독립",
            "자율성",
            "규모의경제",
            "중복투자"
        ]
    },
    {
        "id": 2013,
        "year": 2022,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "맥그리거 XY이론",
        "importance": "S",
        "question": "맥그리거(McGregor)의 X이론에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "인간은 본래 일을 싫어하며 가능한 한 일을 회피하려 한다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "일싫어함",
                    "회피"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "적절한 조건만 주어지면 인간은 스스로 책임을 추구한다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "책임추구"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 3,
                "text": "자율적 통제와 자기지시를 통해 목표 달성이 가능하다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "자율통제"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 4,
                "text": "참여적 관리와 권한 위임을 강조한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "참여적",
                    "권한위임"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            }
        ],
        "answer": 1,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "일싫어함",
            "회피",
            "책임추구",
            "자율통제",
            "참여적",
            "권한위임"
        ]
    },
    {
        "id": 2014,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "책임운영기관",
        "importance": "A",
        "question": "책임운영기관에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "기관의 장에게 인사·조직·예산상의 자율성을 부여한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "자율성"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "성과에 대한 책임을 강조하는 신공공관리적 조직이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "성과책임",
                    "NPM"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "기관장의 임기는 5년으로 고정되어 있다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "5년고정"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "사업적 성격의 행정 업무를 수행하는 기관에 적합하다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "사업적성격"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "자율성",
            "성과책임",
            "NPM",
            "5년고정",
            "사업적성격"
        ]
    },
    {
        "id": 2015,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "리더십",
        "importance": "S",
        "question": "거래적 리더십에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "부하에게 비전을 제시하고 지적 자극을 제공한다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "변혁적"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 2,
                "text": "보상과 처벌의 교환관계를 기반으로 한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "보상",
                    "처벌",
                    "교환"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "부하의 성숙도에 따라 리더십 유형을 변경한다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "상황적"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 4,
                "text": "리더의 타고난 특성이 리더십을 결정한다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "특성이론"
                ],
                "stamp": [
                    "A"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "변혁적",
            "보상",
            "처벌",
            "교환",
            "상황적",
            "특성이론"
        ]
    },
    {
        "id": 2016,
        "year": 2022,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "학습조직",
        "importance": "B",
        "question": "학습조직(learning organization)에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "Senge가 「제5경영」에서 체계적으로 제시하였다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "Senge",
                    "제5경영"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "조직의 표준화된 절차와 규칙을 강화하는 것이 목적이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "표준화"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "계층제적 명령체계를 강화하여 효율성을 높인다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "계층제"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "개인학습만을 강조하고 조직 차원의 학습은 배제한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "개인학습만"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 1,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "Senge",
            "제5경영",
            "표준화",
            "계층제",
            "개인학습만"
        ]
    },
    {
        "id": 2017,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "동기부여",
        "importance": "A",
        "question": "브룸(Vroom)의 기대이론에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "인간의 욕구를 5단계로 구분하였다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "매슬로우"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "동기부여 = 기대감 × 수단성 × 유의성으로 설명한다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "기대감",
                    "수단성",
                    "유의성"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "직무만족과 불만족을 별개의 차원으로 보았다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "허즈버그"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "공정한 보상에 대한 주관적 인식을 강조하였다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "Adams",
                    "공정성"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "매슬로우",
            "기대감",
            "수단성",
            "유의성",
            "허즈버그",
            "Adams",
            "공정성"
        ]
    },
    {
        "id": 2018,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "조직발전(OD)",
        "importance": "B",
        "question": "조직발전(OD)에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "행태과학적 지식과 기법을 활용한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "행태과학"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "계획적·의도적 변화를 추구한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "계획적변화"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "조직 구성원의 태도와 행동 변화를 지향한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "태도행동변화"
                ],
                "stamp": []
            },
            {
                "num": 4,
                "text": "구조적 변화만을 추구하고 인적 요인은 배제한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "구조적변화만"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 4,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "행태과학",
            "계획적변화",
            "태도행동변화",
            "구조적변화만"
        ]
    },
    {
        "id": 2019,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH02",
        "topic": "공기업",
        "importance": "A",
        "question": "공공기관 유형 분류에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "시장형 공기업은 자산규모 2조원 이상이고 자체수입비율 85% 이상이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "시장형",
                    "2조",
                    "85%"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "준시장형 공기업은 시장형 기준에 미달하는 공기업이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "준시장형"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "기금관리형 준정부기관은 기금을 관리·운용하는 기관이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "기금관리형"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "한국관광공사는 시장형 공기업에 해당한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "한국관광공사",
                    "시장형"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 4,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "시장형",
            "2조",
            "85%",
            "준시장형",
            "기금관리형",
            "한국관광공사"
        ]
    },
    {
        "id": 3001,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH03",
        "topic": "직위분류제와 계급제",
        "importance": "S",
        "question": "직위분류제와 계급제에 대한 비교로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "직위분류제는 직무(일) 중심, 계급제는 사람(자격) 중심이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "직무중심",
                    "사람중심"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "직위분류제는 전문가 양성에, 계급제는 일반행정가 양성에 유리하다.",
                "ox": true,
                "what": [
                    "A"
                ],
                "keywords": [
                    "전문가",
                    "일반행정가"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 3,
                "text": "직위분류제는 영국형, 계급제는 미국형이다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "영국형",
                    "미국형"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "직위분류제는 동일 직무에 동일 보수의 원칙을 실현하기 용이하다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "동일보수"
                ],
                "stamp": [
                    "H"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "직무중심",
            "사람중심",
            "전문가",
            "일반행정가",
            "영국형",
            "미국형",
            "동일보수"
        ]
    },
    {
        "id": 3002,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH03",
        "topic": "시보임용",
        "importance": "S",
        "question": "시보임용에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "5급 이상 공무원의 시보임용 기간은 6개월이다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "6개월"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "6급 이하 공무원의 시보임용 기간은 1년이다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "1년"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "5급 이상은 1년, 6급 이하는 6개월의 시보임용 기간을 거친다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "5급1년",
                    "6급6개월"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "시보임용 기간 중에는 면직이 불가능하다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "면직불가"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "6개월",
            "1년",
            "5급1년",
            "6급6개월",
            "면직불가"
        ]
    },
    {
        "id": 3003,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH03",
        "topic": "대표관료제",
        "importance": "S",
        "question": "대표관료제에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "사회의 인적 구성을 반영하여 관료를 충원하는 제도이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "인적구성",
                    "반영"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "소극적 대표성은 관료의 출신 배경이 사회 구성을 반영하는 것이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "소극적",
                    "출신배경"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "적극적 대표성은 출신 집단의 이익을 적극적으로 대변하는 것이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "적극적",
                    "이익대변"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "실적주의를 완전히 대체하는 인사제도이다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "완전대체"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 4,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "인적구성",
            "반영",
            "소극적",
            "출신배경",
            "적극적",
            "이익대변",
            "완전대체"
        ]
    },
    {
        "id": 3004,
        "year": 2022,
        "exam": "국가직",
        "chapter": "CH03",
        "topic": "근무성적 평정 오류",
        "importance": "A",
        "question": "근무성적 평정에서 관대화 및 엄격화 경향이 불규칙하게 나타나는 오류는?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "연쇄효과(halo effect)",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "연쇄효과"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "규칙적 오류(systematic error)",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "규칙적오류"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "집중화 경향(central tendency)",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "집중화경향"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "총계적 오류(random error)",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "총계적오류"
                ],
                "stamp": [
                    "H"
                ]
            }
        ],
        "answer": 4,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "연쇄효과",
            "규칙적오류",
            "집중화경향",
            "총계적오류"
        ]
    },
    {
        "id": 3005,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH03",
        "topic": "파킨슨·피터의 법칙",
        "importance": "A",
        "question": "파킨슨 법칙(Parkinson's Law)의 내용으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "공무원은 무능력 수준에 이를 때까지 승진한다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "무능력수준",
                    "승진"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "공무원 수는 업무량과 관계없이 일정 비율로 증가한다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "업무량무관",
                    "증가"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "조직의 성과는 투입 자원에 비례하여 증가한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "투입비례"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "관료 조직은 시간이 지나면 자동적으로 효율화된다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "자동효율화"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "무능력수준",
            "승진",
            "업무량무관",
            "증가",
            "투입비례",
            "자동효율화"
        ]
    },
    {
        "id": 3006,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH03",
        "topic": "소청심사",
        "importance": "S",
        "question": "소청심사제도에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "공무원이 징계처분에 불복할 때 이용할 수 있다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "징계불복"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "처분사유 설명서를 받은 날부터 30일 이내에 청구해야 한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "30일이내"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "소청심사위원회는 행정부 소속으로 독립성이 없다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "독립성없음"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "소청심사 결정에 불복하면 행정소송을 제기할 수 있다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "행정소송"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "징계불복",
            "30일이내",
            "독립성없음",
            "행정소송"
        ]
    },
    {
        "id": 3007,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH03",
        "topic": "고위공무원단",
        "importance": "A",
        "question": "고위공무원단 제도에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "계급제를 강화하기 위해 도입된 제도이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "계급제강화"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "직무성과계약을 통해 성과를 관리한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "직무성과계약"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "모든 공무원에게 적용되는 보편적 제도이다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "모든공무원"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "정치적 임명을 우선으로 하는 제도이다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "정치적임명"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "계급제강화",
            "직무성과계약",
            "모든공무원",
            "정치적임명"
        ]
    },
    {
        "id": 3008,
        "year": 2022,
        "exam": "국가직",
        "chapter": "CH03",
        "topic": "실적주의와 엽관주의",
        "importance": "S",
        "question": "실적주의(merit system)의 특징으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "공개경쟁시험에 의한 임용을 원칙으로 한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "공개경쟁시험"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "정치적 중립을 보장한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "정치적중립"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "선거에서 승리한 정당이 관직을 배분한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "정당",
                    "관직배분"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "신분 보장을 통해 행정의 안정성을 확보한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "신분보장"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "공개경쟁시험",
            "정치적중립",
            "정당",
            "관직배분",
            "신분보장"
        ]
    },
    {
        "id": 3009,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH03",
        "topic": "피터의 원리",
        "importance": "B",
        "question": "피터의 원리(Peter Principle)의 내용으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "공무원 수는 업무량과 관계없이 증가한다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "파킨슨"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "모든 구성원은 자신의 무능력 수준까지 승진한다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "무능력수준",
                    "승진"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "조직은 시간이 지나면 자동으로 쇠퇴한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "자동쇠퇴"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "공무원은 부하 직원의 수를 늘리려 한다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "파킨슨"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "파킨슨",
            "무능력수준",
            "승진",
            "자동쇠퇴"
        ]
    },
    {
        "id": 3010,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH03",
        "topic": "전략적 HRM",
        "importance": "B",
        "question": "전략적 인적자원관리(Strategic HRM)에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "조직의 전략과 인사관리를 연계한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "전략연계"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "장기적 인적자본 투자를 강조한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "장기적",
                    "인적자본"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "단기적 인건비 절감이 최우선 과제이다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "단기적",
                    "인건비절감"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "성과 중심의 인사관리를 지향한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "성과중심"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "전략연계",
            "장기적",
            "인적자본",
            "단기적",
            "인건비절감",
            "성과중심"
        ]
    },
    {
        "id": 3011,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH03",
        "topic": "공무원 분류",
        "importance": "S",
        "question": "특수경력직 공무원에 해당하지 않는 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "정무직 공무원",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "정무직"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "별정직 공무원",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "별정직"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "일반직 공무원",
                "ox": false,
                "what": [
                    "H",
                    "T"
                ],
                "keywords": [
                    "일반직",
                    "경력직"
                ],
                "stamp": [
                    "H",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "비서관·비서",
                "ox": true,
                "what": [],
                "keywords": [
                    "비서관"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "정무직",
            "별정직",
            "일반직",
            "경력직",
            "비서관"
        ]
    },
    {
        "id": 3012,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH03",
        "topic": "공직윤리",
        "importance": "A",
        "question": "공직자윤리법상 재산등록 의무자에 해당하지 않는 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "4급 이상 공무원",
                "ox": true,
                "what": [],
                "keywords": [
                    "4급이상"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "공직유관단체의 장",
                "ox": true,
                "what": [],
                "keywords": [
                    "공직유관단체"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "모든 9급 공무원",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "모든9급"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "감사원 소속 공무원",
                "ox": true,
                "what": [],
                "keywords": [
                    "감사원"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "4급이상",
            "공직유관단체",
            "모든9급",
            "감사원"
        ]
    },
    {
        "id": 4001,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH04",
        "topic": "예산제도",
        "importance": "S",
        "question": "예산제도에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "품목별 예산제도(LIBS)는 성과와 결과 중심의 예산 편성 방식이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "성과중심"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "성과주의 예산(PBS)은 업무 단위와 단위원가를 기준으로 예산을 편성한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "업무단위",
                    "단위원가"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "계획예산(PPBS)은 전년도 기준 소폭 증감하는 방식이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "전년도기준",
                    "소폭증감"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "영기준 예산(ZBB)은 투입 항목별로 지출을 통제하는 방식이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "투입항목",
                    "통제"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "성과중심",
            "업무단위",
            "단위원가",
            "전년도기준",
            "소폭증감",
            "투입항목",
            "통제"
        ]
    },
    {
        "id": 4002,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH04",
        "topic": "예산제도",
        "importance": "S",
        "question": "영기준예산(ZBB)에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "전년도 예산을 기준으로 일정 비율을 증감하여 편성한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "전년도기준"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "모든 사업을 영(zero)에서부터 재검토하여 우선순위를 결정한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "영기준",
                    "재검토",
                    "우선순위"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "장기 목표와 단기 예산을 연계하는 기획 지향적 예산이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "장기목표",
                    "기획지향"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "지출 대상의 품목별로 예산을 분류하는 통제 지향적 예산이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "품목별",
                    "통제지향"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "전년도기준",
            "영기준",
            "재검토",
            "우선순위",
            "장기목표",
            "기획지향",
            "품목별",
            "통제지향"
        ]
    },
    {
        "id": 4003,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH04",
        "topic": "정부지출 증가론",
        "importance": "S",
        "question": "바그너 법칙(Wagner's Law)에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "전쟁 등 위기 후에도 정부지출이 이전 수준으로 복귀하지 않는다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "위기",
                    "복귀불가"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "산업화가 진행될수록 국가활동이 증대하는 것은 필연적이다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "산업화",
                    "국가활동증대"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "정부는 노동집약적이어서 임금 상승이 비용 증가로 이어진다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "노동집약적",
                    "임금상승"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "관료들의 예산 극대화 행동이 정부규모를 확대시킨다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "예산극대화"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "위기",
            "복귀불가",
            "산업화",
            "국가활동증대",
            "노동집약적",
            "임금상승",
            "예산극대화"
        ]
    },
    {
        "id": 4004,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH04",
        "topic": "조세지출",
        "importance": "A",
        "question": "조세지출에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "비과세, 감면, 공제 등의 형태로 나타난다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "비과세",
                    "감면",
                    "공제"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "감추어진 보조금(hidden subsidy)이라고 불린다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "감추어진보조금"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "실제 재정지출과 동일한 효과를 갖는다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "재정지출효과"
                ],
                "stamp": []
            },
            {
                "num": 4,
                "text": "예산에 직접 계상되어 의회의 통제를 받기 용이하다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "직접계상",
                    "통제용이"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 4,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "비과세",
            "감면",
            "공제",
            "감추어진보조금",
            "재정지출효과",
            "직접계상",
            "통제용이"
        ]
    },
    {
        "id": 4005,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH04",
        "topic": "회계제도",
        "importance": "A",
        "question": "복식부기·발생주의 회계에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "차변과 대변을 동시에 기록하여 상호 검증이 용이하다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "차변",
                    "대변",
                    "상호검증"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "현금의 수입·지출 시점을 기준으로 거래를 기록한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "현금주의"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "자산, 부채, 순자산의 재정상태를 파악할 수 있다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "자산",
                    "부채",
                    "순자산"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "감가상각 등 비현금 비용도 인식할 수 있다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "감가상각"
                ],
                "stamp": []
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "차변",
            "대변",
            "상호검증",
            "현금주의",
            "자산",
            "부채",
            "순자산",
            "감가상각"
        ]
    },
    {
        "id": 4006,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH04",
        "topic": "예산과정",
        "importance": "S",
        "question": "우리나라 예산과정에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "예산의 편성은 국회가 담당한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "국회편성"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "예산의 심의·확정은 행정부가 담당한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "행정부심의"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "예산안은 회계연도 개시 120일 전까지 국회에 제출한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "120일전"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "결산은 국회가 직접 실시한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "국회결산"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "국회편성",
            "행정부심의",
            "120일전",
            "국회결산"
        ]
    },
    {
        "id": 4007,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH04",
        "topic": "예산원칙",
        "importance": "A",
        "question": "예산 총계주의 원칙의 예외에 해당하는 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "일반회계",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "일반회계"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "특별회계",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "특별회계"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "추가경정예산",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "추경"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "본예산",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "본예산"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "일반회계",
            "특별회계",
            "추경",
            "본예산"
        ]
    },
    {
        "id": 4008,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH04",
        "topic": "전위효과",
        "importance": "S",
        "question": "피콕과 와이즈만(Peacock & Wiseman)의 전위효과에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "산업화에 따라 국가활동이 필연적으로 증대한다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "산업화",
                    "바그너"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "전쟁·재난 등 위기 후에도 정부지출이 이전 수준으로 돌아가지 않는다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "위기",
                    "복귀불가"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "정부 부문의 노동집약적 성격 때문에 비용이 증가한다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "보몰효과"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "관료의 예산극대화 동기가 정부규모를 확대시킨다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "니스카넨"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "산업화",
            "바그너",
            "위기",
            "복귀불가",
            "보몰효과",
            "니스카넨"
        ]
    },
    {
        "id": 4009,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH04",
        "topic": "보몰효과",
        "importance": "A",
        "question": "보몰효과(Baumol Effect)에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "위기 시 정부지출이 급증하는 현상이다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "전위효과"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "정부는 노동집약적이어서 임금 상승이 비용 증가로 이어진다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "노동집약적",
                    "임금상승"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "산업화에 따른 국가기능 확대를 의미한다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "바그너"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "행정수요의 증가에 따른 세출 증대를 의미한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "행정수요"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "전위효과",
            "노동집약적",
            "임금상승",
            "바그너",
            "행정수요"
        ]
    },
    {
        "id": 4010,
        "year": 2022,
        "exam": "국가직",
        "chapter": "CH04",
        "topic": "점증주의예산",
        "importance": "S",
        "question": "점증주의 예산이론에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "Wildavsky가 대표적 학자이다.",
                "ox": true,
                "what": [
                    "W"
                ],
                "keywords": [
                    "Wildavsky"
                ],
                "stamp": [
                    "W"
                ]
            },
            {
                "num": 2,
                "text": "전년도 예산을 기준으로 소폭 증감한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "전년도",
                    "소폭증감"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "정치적 타협의 산물로서의 예산을 설명한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "정치적타협"
                ],
                "stamp": []
            },
            {
                "num": 4,
                "text": "모든 사업을 영(zero)에서 재검토하여 우선순위를 결정한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "영기준",
                    "ZBB"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            }
        ],
        "answer": 4,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "Wildavsky",
            "전년도",
            "소폭증감",
            "정치적타협",
            "영기준",
            "ZBB"
        ]
    },
    {
        "id": 4011,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH04",
        "topic": "국가재정운용계획",
        "importance": "B",
        "question": "국가재정운용계획에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "단년도 예산 편성을 위한 계획이다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "단년도"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "5개년 중기 재정계획으로 매년 국회에 제출한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "5개년",
                    "중기"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "국회가 직접 수립하는 재정계획이다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "국회수립"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "법적 구속력이 있는 확정적 계획이다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "법적구속력"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "단년도",
            "5개년",
            "중기",
            "국회수립",
            "법적구속력"
        ]
    },
    {
        "id": 4012,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH04",
        "topic": "계획예산(PPBS)",
        "importance": "S",
        "question": "계획예산제도(PPBS)에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "지출 대상의 품목별로 예산을 분류한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "품목별",
                    "LIBS"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "장기 목표 설정→대안 분석→자원 배분을 연계하는 기획 지향적 예산이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "장기목표",
                    "대안분석",
                    "기획지향"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "업무 단위와 단위원가를 기준으로 예산을 편성한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "단위원가",
                    "PBS"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "전년도 예산을 기준으로 소폭 증감한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "전년도",
                    "점증"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "품목별",
            "LIBS",
            "장기목표",
            "대안분석",
            "기획지향",
            "단위원가",
            "PBS",
            "전년도",
            "점증"
        ]
    },
    {
        "id": 4013,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH04",
        "topic": "품목별예산",
        "importance": "A",
        "question": "품목별 예산제도(LIBS)에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "통제 지향적이며 지출 대상(인건비, 여비 등)을 중심으로 분류한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "통제지향",
                    "지출대상"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "사업의 성과를 측정하고 관리하는 데 효과적이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "성과측정",
                    "PBS"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "장기적 기획과 자원 배분에 적합한 예산 방식이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "장기기획",
                    "PPBS"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "모든 사업을 영에서부터 재검토하는 방식이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "영기준",
                    "ZBB"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            }
        ],
        "answer": 1,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "통제지향",
            "지출대상",
            "성과측정",
            "PBS",
            "장기기획",
            "PPBS",
            "영기준",
            "ZBB"
        ]
    },
    {
        "id": 4014,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH04",
        "topic": "예산결정이론",
        "importance": "B",
        "question": "총체주의(합리주의) 예산결정에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "예산결정을 정치적 과정으로 이해한다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "점증주의"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 2,
                "text": "모든 대안을 비교·분석하여 최적 배분을 추구한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "모든대안",
                    "최적배분"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "전년도 예산을 기반으로 점진적으로 조정한다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "점증주의"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 4,
                "text": "정보 부족과 시간 제약을 인정하고 소폭 수정한다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "점증주의"
                ],
                "stamp": [
                    "A"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "점증주의",
            "모든대안",
            "최적배분"
        ]
    },
    {
        "id": 5001,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "정책결정모형",
        "importance": "S",
        "question": "점증모형에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "Lindblom이 제시한 정책결정 모형이다.",
                "ox": true,
                "what": [
                    "W"
                ],
                "keywords": [
                    "Lindblom"
                ],
                "stamp": [
                    "W"
                ]
            },
            {
                "num": 2,
                "text": "완전한 정보와 합리성을 전제로 최적 대안을 선택한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "완전정보",
                    "합리성",
                    "최적대안"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "기존 정책의 소폭 수정을 통해 점진적 변화를 추구한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "소폭수정",
                    "점진적"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "정치적 타협과 상호 조정을 중시한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "정치적타협",
                    "상호조정"
                ],
                "stamp": []
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "Lindblom",
            "완전정보",
            "합리성",
            "최적대안",
            "소폭수정",
            "점진적",
            "정치적타협",
            "상호조정"
        ]
    },
    {
        "id": 5002,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "정책결정모형",
        "importance": "S",
        "question": "쓰레기통 모형에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "Cohen, March, Olsen이 제시하였다.",
                "ox": true,
                "what": [
                    "W"
                ],
                "keywords": [
                    "Cohen",
                    "March",
                    "Olsen"
                ],
                "stamp": [
                    "W"
                ]
            },
            {
                "num": 2,
                "text": "문제, 해결책, 참여자, 선택기회가 독립적으로 흐르다가 우연히 결합한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "우연결합"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "명확한 목표와 수단-목표 분석에 의해 정책이 결정된다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "명확한목표",
                    "수단목표분석"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "조직화된 무정부(organized anarchy) 상태에서의 의사결정을 설명한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "조직화된무정부"
                ],
                "stamp": [
                    "H"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "Cohen",
            "March",
            "Olsen",
            "우연결합",
            "명확한목표",
            "수단목표분석",
            "조직화된무정부"
        ]
    },
    {
        "id": 5003,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "정책유형",
        "importance": "S",
        "question": "Lowi의 정책유형 분류에서 비용은 다수에게 분산되고 편익은 소수에게 집중되는 유형은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "배분정책",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "배분정책"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "규제정책",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "규제정책"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "재분배정책",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "재분배정책"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "구성정책",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "구성정책"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "배분정책",
            "규제정책",
            "재분배정책",
            "구성정책"
        ]
    },
    {
        "id": 5004,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "킹던 다중흐름모형",
        "importance": "S",
        "question": "킹던(Kingdon)의 다중흐름모형에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "문제의 흐름, 정책의 흐름, 정치의 흐름이 합류하여 정책의 창이 열린다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "3가지흐름",
                    "정책의창"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "합리적 분석과 비용편익분석에 의해 정책이 결정된다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "합리적분석"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "정책결정은 항상 예측 가능한 순서로 이루어진다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "예측가능"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "정책 참여자의 역할은 고정되어 있다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "역할고정"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 1,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "3가지흐름",
            "정책의창",
            "합리적분석",
            "예측가능",
            "역할고정"
        ]
    },
    {
        "id": 5005,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "니스카넨 모형",
        "importance": "A",
        "question": "니스카넨(Niskanen)의 예산극대화 모형에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "관료는 자신의 소관 예산을 극대화하려는 동기가 있다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "예산극대화"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "관료는 공익을 최우선으로 추구하는 이타적 존재이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "공익최우선",
                    "이타적"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "정보비대칭으로 관료가 의회보다 우위에 있다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "정보비대칭"
                ],
                "stamp": []
            },
            {
                "num": 4,
                "text": "정부 예산의 과다 공급(oversupply) 문제를 설명한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "과다공급"
                ],
                "stamp": []
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "예산극대화",
            "공익최우선",
            "이타적",
            "정보비대칭",
            "과다공급"
        ]
    },
    {
        "id": 5006,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "혼합모형",
        "importance": "S",
        "question": "에치오니(Etzioni)의 혼합탐사모형에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "근본적 결정에는 합리모형, 세부적 결정에는 점증모형을 적용한다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "근본적결정",
                    "세부적결정"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "문제, 해결책, 참여자가 우연히 결합하는 모형이다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "우연결합",
                    "쓰레기통"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "완전한 합리성만을 전제로 한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "완전합리성"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "기존 정책의 소폭 수정만을 허용한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "소폭수정",
                    "점증"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            }
        ],
        "answer": 1,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "근본적결정",
            "세부적결정",
            "우연결합",
            "쓰레기통",
            "완전합리성",
            "소폭수정",
            "점증"
        ]
    },
    {
        "id": 5007,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "정책집행",
        "importance": "S",
        "question": "하향적(top-down) 정책집행에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "정책결정자의 의도에 충실한 집행을 강조한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "결정자의도"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "일선관료의 재량과 자율성을 중시한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "일선관료",
                    "재량"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "명확한 정책목표와 인과관계를 전제로 한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "명확한목표"
                ],
                "stamp": []
            },
            {
                "num": 4,
                "text": "Sabatier, Mazmanian 등이 대표적 학자이다.",
                "ox": true,
                "what": [
                    "W"
                ],
                "keywords": [
                    "Sabatier",
                    "Mazmanian"
                ],
                "stamp": [
                    "W"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "결정자의도",
            "일선관료",
            "재량",
            "명확한목표",
            "Sabatier",
            "Mazmanian"
        ]
    },
    {
        "id": 5008,
        "year": 2022,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "정책집행",
        "importance": "A",
        "question": "상향적(bottom-up) 정책집행에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "정책결정자의 의도대로 집행되는 것을 최선으로 본다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "결정자의도"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 2,
                "text": "일선관료(street-level bureaucrats)의 재량과 역할을 중시한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "일선관료",
                    "재량"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "명확한 정책목표의 설정이 가장 중요하다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "명확한목표"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 4,
                "text": "집행 현장의 자율성을 배제한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "자율성배제"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "결정자의도",
            "일선관료",
            "재량",
            "명확한목표",
            "자율성배제"
        ]
    },
    {
        "id": 5009,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "정책평가",
        "importance": "A",
        "question": "총괄평가(summative evaluation)에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "정책 집행 과정에서 수정·보완을 위해 실시한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "형성평가"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "정책이 종료된 후 최종 효과를 판단하기 위해 실시한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "종료후",
                    "최종효과"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "정책 집행 이전에 실시하는 사전적 평가이다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "사전적"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "정책 설계 단계에서의 타당성 검토이다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "설계단계"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "형성평가",
            "종료후",
            "최종효과",
            "사전적",
            "설계단계"
        ]
    },
    {
        "id": 5010,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "정책유형",
        "importance": "S",
        "question": "Wilson의 규제정치 모형에서 비용과 편익이 모두 넓게 분산되는 유형은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "대중적 정치(majoritarian politics)",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "대중적정치"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "이익집단 정치(interest group politics)",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "이익집단"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "고객 정치(client politics)",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "고객정치"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "기업가적 정치(entrepreneurial politics)",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "기업가적"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 1,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "대중적정치",
            "이익집단",
            "고객정치",
            "기업가적"
        ]
    },
    {
        "id": 5011,
        "year": 2022,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "오스트롬",
        "importance": "A",
        "question": "엘리너 오스트롬(E. Ostrom)의 이론에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "관료는 예산 극대화를 추구하는 합리적 존재이다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "니스카넨"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "공유자원(commons)의 자치적 관리가 가능함을 입증하였다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "공유자원",
                    "자치관리"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "공공재는 반드시 정부가 공급해야 한다고 주장하였다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "정부공급"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "공공선택이론에서 방법론적 전체주의를 채택하였다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "전체주의"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "니스카넨",
            "공유자원",
            "자치관리",
            "정부공급",
            "전체주의"
        ]
    },
    {
        "id": 5012,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "사이버네틱스 모형",
        "importance": "B",
        "question": "사이버네틱스(cybernetics) 의사결정 모형에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "적응적 의사결정을 강조한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "적응적"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "광범위한 대안 탐색을 강조한다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "광범위탐색"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "사전에 프로그램된 메커니즘에 의해 결정한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "프로그램메커니즘"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "소수의 핵심 변수에 집중하여 불확실성을 통제한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "핵심변수"
                ],
                "stamp": []
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "적응적",
            "광범위탐색",
            "프로그램메커니즘",
            "핵심변수"
        ]
    },
    {
        "id": 5013,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "엘리트이론",
        "importance": "A",
        "question": "엘리트이론에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "다양한 집단이 정책과정에 균등하게 참여한다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "다원주의"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 2,
                "text": "소수의 엘리트가 정책결정을 지배한다고 본다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "소수엘리트",
                    "지배"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "이익집단 간의 경쟁이 최선의 정책을 만든다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "이익집단경쟁"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 4,
                "text": "무의사결정은 존재하지 않는다고 본다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "무의사결정"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "다원주의",
            "소수엘리트",
            "지배",
            "이익집단경쟁",
            "무의사결정"
        ]
    },
    {
        "id": 5014,
        "year": 2022,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "정책네트워크",
        "importance": "B",
        "question": "정책네트워크에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "이슈네트워크는 참여자가 다양하고 개방적이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "이슈네트워크",
                    "개방적"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "정책공동체는 참여자가 제한적이고 안정적이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "정책공동체",
                    "제한적"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "이슈네트워크가 정책공동체보다 결합도가 높다.",
                "ox": false,
                "what": [
                    "A",
                    "T"
                ],
                "keywords": [
                    "결합도"
                ],
                "stamp": [
                    "A",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "철의 삼각(iron triangle)은 폐쇄적 정책네트워크의 한 유형이다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "철의삼각"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "이슈네트워크",
            "개방적",
            "정책공동체",
            "제한적",
            "결합도",
            "철의삼각"
        ]
    },
    {
        "id": 5015,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "정책의제설정",
        "importance": "S",
        "question": "콥과 로스(Cobb & Ross)의 정책의제설정 모형 중 외부주도형에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "정부 내부에서 자체적으로 정책의제가 형성된다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "내부주도형"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 2,
                "text": "사회집단이 이슈를 제기하고 공중의제를 거쳐 정부의제로 채택된다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "사회집단",
                    "공중의제",
                    "정부의제"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "정부가 먼저 정책을 결정한 후 국민에게 홍보한다.",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "동원형"
                ],
                "stamp": [
                    "A"
                ]
            },
            {
                "num": 4,
                "text": "의제설정 과정이 비공개적으로 진행된다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "비공개"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "내부주도형",
            "사회집단",
            "공중의제",
            "정부의제",
            "동원형",
            "비공개"
        ]
    },
    {
        "id": 5016,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "정책유형",
        "importance": "S",
        "question": "Salisbury의 정책유형 분류에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "강제성의 정도에 따라 정책을 분류한다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "Lowi"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "비용과 편익의 분산·집중에 따라 분류한다.",
                "ox": false,
                "what": [
                    "W",
                    "T"
                ],
                "keywords": [
                    "Wilson"
                ],
                "stamp": [
                    "W",
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "요구패턴과 결정체제에 따라 정책유형을 구분한다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "요구패턴",
                    "결정체제"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "정책의 시간적 범위에 따라 분류한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "시간적범위"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "Lowi",
            "Wilson",
            "요구패턴",
            "결정체제",
            "시간적범위"
        ]
    },
    {
        "id": 5017,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "정책변동",
        "importance": "A",
        "question": "Sabatier의 정책옹호연합모형(ACF)에 대한 설명으로 옳은 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "정책변동을 10년 이상의 장기적 시간 틀에서 분석한다.",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "10년이상",
                    "장기적"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "정책변동은 단기간에 급격하게 이루어진다고 본다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "단기간"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "정책하위체제 내에서 단일 집단만이 정책을 결정한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "단일집단"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "외부 환경의 영향을 배제하고 내부 역학만을 분석한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "외부배제"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 1,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "10년이상",
            "장기적",
            "단기간",
            "단일집단",
            "외부배제"
        ]
    },
    {
        "id": 5018,
        "year": 2022,
        "exam": "국가직",
        "chapter": "CH05",
        "topic": "비용편익분석",
        "importance": "B",
        "question": "비용편익분석(CBA)에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "대안별 비용과 편익을 화폐 가치로 환산하여 비교한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "화폐가치"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "내부수익률(IRR)과 순현재가치(NPV) 등을 활용한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "IRR",
                    "NPV"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "무형적·비계량적 효과도 완벽하게 측정할 수 있다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "완벽측정"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "공공사업의 경제적 타당성 검토에 주로 사용된다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "경제적타당성"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "화폐가치",
            "IRR",
            "NPV",
            "완벽측정",
            "경제적타당성"
        ]
    },
    {
        "id": 6001,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH06",
        "topic": "지방교부세",
        "importance": "A",
        "question": "지방교부세에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "중앙정부가 교부할 때 지출 용도를 제한한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "용도제한"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 2,
                "text": "지방자치단체의 고유 재원이라는 성격을 가진다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "고유재원"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "지역 간 재정력 격차를 완화하는 기능을 수행한다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "재정력격차",
                    "완화"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "재정적 결함이 있는 지방자치단체에 재원을 교부한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "재정적결함"
                ],
                "stamp": []
            }
        ],
        "answer": 1,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "용도제한",
            "고유재원",
            "재정력격차",
            "완화",
            "재정적결함"
        ]
    },
    {
        "id": 6002,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH06",
        "topic": "주민참여",
        "importance": "A",
        "question": "지방자치법상 주민참여 수단에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "주요 결정사항에 대해 주민투표를 실시할 수 있다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "주민투표"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "비례대표 의원에 대해서도 주민소환이 가능하다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "비례대표",
                    "주민소환"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "18세 이상 주민은 감사청구를 할 수 있다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "18세",
                    "감사청구"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "조례의 제정·개정을 청구할 수 있다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "조례청구"
                ],
                "stamp": []
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "주민투표",
            "비례대표",
            "주민소환",
            "18세",
            "감사청구",
            "조례청구"
        ]
    },
    {
        "id": 6003,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH06",
        "topic": "특별지방행정기관",
        "importance": "B",
        "question": "특별지방행정기관에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "중앙행정기관의 소속 기관으로서 특정 업무를 수행한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "소속기관"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "해당 지역의 자치단체장이 직접 지휘·감독한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "자치단체장"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "지방세무서, 지방노동청 등이 이에 해당한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "지방세무서"
                ],
                "stamp": []
            },
            {
                "num": 4,
                "text": "중앙정부의 전문적 행정수요에 대응하기 위해 설치한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "전문적행정"
                ],
                "stamp": []
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "소속기관",
            "자치단체장",
            "지방세무서",
            "전문적행정"
        ]
    },
    {
        "id": 6004,
        "year": 2022,
        "exam": "국가직",
        "chapter": "CH06",
        "topic": "광역행정",
        "importance": "B",
        "question": "광역행정의 방식 중 행정협의회에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "2개 이상의 지방자치단체가 공동 설립한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "공동설립"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "구성 자치단체에 대한 강제적 구속력이 있다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "강제구속력"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "구성원 간 협의를 통해 공동 문제를 해결한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "협의",
                    "공동문제"
                ],
                "stamp": []
            },
            {
                "num": 4,
                "text": "사무의 일부를 공동으로 처리할 수 있다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "공동처리"
                ],
                "stamp": []
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "공동설립",
            "강제구속력",
            "협의",
            "공동문제",
            "공동처리"
        ]
    },
    {
        "id": 6005,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH06",
        "topic": "자치권",
        "importance": "S",
        "question": "지방자치단체의 자치권에 해당하지 않는 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "자치입법권",
                "ox": true,
                "what": [],
                "keywords": [
                    "자치입법권"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "자치행정권",
                "ox": true,
                "what": [],
                "keywords": [
                    "자치행정권"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "자치사법권",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "자치사법권"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "자치재정권",
                "ox": true,
                "what": [],
                "keywords": [
                    "자치재정권"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "자치입법권",
            "자치행정권",
            "자치사법권",
            "자치재정권"
        ]
    },
    {
        "id": 6006,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH06",
        "topic": "국고보조금",
        "importance": "A",
        "question": "국고보조금에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "용도가 지정된 특정재원이다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "용도지정",
                    "특정재원"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "중앙정부의 정책을 지방에서 집행하기 위해 교부한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "정책집행"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "지방자치단체의 재정자주성을 높이는 데 기여한다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "재정자주성"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "대응자금(matching fund)을 요구하는 경우가 있다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "대응자금"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "용도지정",
            "특정재원",
            "정책집행",
            "재정자주성",
            "대응자금"
        ]
    },
    {
        "id": 7001,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH07",
        "topic": "행정통제",
        "importance": "A",
        "question": "외부통제에 해당하지 않는 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "국정감사",
                "ox": true,
                "what": [],
                "keywords": [
                    "국정감사"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "감사원 감사",
                "ox": true,
                "what": [],
                "keywords": [
                    "감사원"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "직업윤리 강령",
                "ox": false,
                "what": [
                    "H",
                    "T"
                ],
                "keywords": [
                    "직업윤리",
                    "내부통제"
                ],
                "stamp": [
                    "H",
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "옴부즈만 제도",
                "ox": true,
                "what": [],
                "keywords": [
                    "옴부즈만"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "국정감사",
            "감사원",
            "직업윤리",
            "내부통제",
            "옴부즈만"
        ]
    },
    {
        "id": 7002,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH07",
        "topic": "행정윤리",
        "importance": "A",
        "question": "행정윤리의 확보 방안 중 내부적 통제에 해당하는 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "국회의 국정조사",
                "ox": false,
                "what": [
                    "H"
                ],
                "keywords": [
                    "국정조사",
                    "외부"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "시민단체의 감시활동",
                "ox": false,
                "what": [
                    "H"
                ],
                "keywords": [
                    "시민단체",
                    "외부"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "공직자 윤리강령",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "윤리강령",
                    "내부"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "사법부의 판결",
                "ox": false,
                "what": [
                    "H"
                ],
                "keywords": [
                    "사법부",
                    "외부"
                ],
                "stamp": [
                    "H"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "국정조사",
            "외부",
            "시민단체",
            "윤리강령",
            "내부",
            "사법부"
        ]
    },
    {
        "id": 7003,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH07",
        "topic": "옴부즈만",
        "importance": "B",
        "question": "옴부즈만(Ombudsman) 제도에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "국민의 권익침해에 대한 고충을 처리한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "고충처리"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "행정기관의 위법·부당한 처분을 직접 취소할 수 있다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "직접취소"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 3,
                "text": "행정의 투명성과 책임성을 높이는 데 기여한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "투명성",
                    "책임성"
                ],
                "stamp": []
            },
            {
                "num": 4,
                "text": "스웨덴에서 처음 시작된 제도이다.",
                "ox": true,
                "what": [
                    "W"
                ],
                "keywords": [
                    "스웨덴"
                ],
                "stamp": [
                    "W"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "고충처리",
            "직접취소",
            "투명성",
            "책임성",
            "스웨덴"
        ]
    },
    {
        "id": 7004,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH07",
        "topic": "행정책임",
        "importance": "A",
        "question": "Friedrich와 Finer의 행정책임 논쟁에서 Friedrich가 강조한 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "외부적·제도적 통제를 통한 책임 확보",
                "ox": false,
                "what": [
                    "W",
                    "A"
                ],
                "keywords": [
                    "Finer"
                ],
                "stamp": [
                    "W",
                    "A"
                ]
            },
            {
                "num": 2,
                "text": "내재적 책임, 전문가적 기준에 의한 자율적 책임",
                "ox": true,
                "what": [
                    "W",
                    "H"
                ],
                "keywords": [
                    "내재적",
                    "전문가적",
                    "자율적"
                ],
                "stamp": [
                    "W",
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "입법부에 의한 엄격한 감독",
                "ox": false,
                "what": [
                    "W",
                    "A"
                ],
                "keywords": [
                    "Finer"
                ],
                "stamp": [
                    "W",
                    "A"
                ]
            },
            {
                "num": 4,
                "text": "사법적 통제의 강화",
                "ox": false,
                "what": [
                    "A"
                ],
                "keywords": [
                    "사법통제"
                ],
                "stamp": [
                    "A"
                ]
            }
        ],
        "answer": 2,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "Finer",
            "내재적",
            "전문가적",
            "자율적",
            "사법통제"
        ]
    },
    {
        "id": 8001,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH08",
        "topic": "전자정부",
        "importance": "B",
        "question": "전자정부에 대한 설명으로 옳지 않은 것은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "정보통신기술을 활용하여 행정 효율성을 높인다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "ICT",
                    "효율성"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "G2C, G2B, G2G 등의 서비스 유형이 있다.",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "G2C",
                    "G2B",
                    "G2G"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "정보 격차(digital divide) 문제를 완전히 해소할 수 있다.",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "정보격차",
                    "완전해소"
                ],
                "stamp": [
                    "T"
                ]
            },
            {
                "num": 4,
                "text": "행정의 투명성과 국민 참여를 촉진한다.",
                "ox": true,
                "what": [],
                "keywords": [
                    "투명성",
                    "참여"
                ],
                "stamp": []
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "ICT",
            "효율성",
            "G2C",
            "G2B",
            "G2G",
            "정보격차",
            "완전해소",
            "투명성",
            "참여"
        ]
    },
    {
        "id": 8002,
        "year": 2023,
        "exam": "국가직",
        "chapter": "CH08",
        "topic": "데이터3법",
        "importance": "A",
        "question": "데이터3법에 포함되지 않는 법률은?",
        "type": "negative",
        "choices": [
            {
                "num": 1,
                "text": "개인정보 보호법",
                "ox": true,
                "what": [],
                "keywords": [
                    "개인정보보호법"
                ],
                "stamp": []
            },
            {
                "num": 2,
                "text": "정보통신망법",
                "ox": true,
                "what": [],
                "keywords": [
                    "정보통신망법"
                ],
                "stamp": []
            },
            {
                "num": 3,
                "text": "신용정보법",
                "ox": true,
                "what": [],
                "keywords": [
                    "신용정보법"
                ],
                "stamp": []
            },
            {
                "num": 4,
                "text": "데이터 산업진흥법",
                "ox": false,
                "what": [
                    "T"
                ],
                "keywords": [
                    "데이터산업진흥법"
                ],
                "stamp": [
                    "T"
                ]
            }
        ],
        "answer": 4,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "개인정보보호법",
            "정보통신망법",
            "신용정보법",
            "데이터산업진흥법"
        ]
    },
    {
        "id": 9001,
        "year": 2024,
        "exam": "국가직",
        "chapter": "CH09",
        "topic": "행정개혁",
        "importance": "B",
        "question": "행정개혁의 접근 방법 중 구조적 접근에 해당하는 것은?",
        "type": "positive",
        "choices": [
            {
                "num": 1,
                "text": "공무원 교육훈련 강화",
                "ox": false,
                "what": [
                    "H"
                ],
                "keywords": [
                    "인적접근"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 2,
                "text": "정보시스템 도입",
                "ox": false,
                "what": [
                    "H"
                ],
                "keywords": [
                    "기술적접근"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 3,
                "text": "조직의 통폐합",
                "ox": true,
                "what": [
                    "H"
                ],
                "keywords": [
                    "구조적접근",
                    "통폐합"
                ],
                "stamp": [
                    "H"
                ]
            },
            {
                "num": 4,
                "text": "조직문화 혁신",
                "ox": false,
                "what": [
                    "H"
                ],
                "keywords": [
                    "행태적접근"
                ],
                "stamp": [
                    "H"
                ]
            }
        ],
        "answer": 3,
        "subject": "행정학",
        "sourceCategory": "국가직 기출/쌍둥이모의 선별",
        "keywords": [
            "인적접근",
            "기술적접근",
            "구조적접근",
            "통폐합",
            "행태적접근"
        ]
    }
];

function generateAdminOXFromChoice(q, choiceIdx) {
    const c = q.choices[choiceIdx];
    return {
        questionId: q.id,
        choiceNum: c.num,
        chapter: q.chapter,
        topic: q.topic,
        importance: q.importance,
        text: c.text,
        answer: c.ox,
        what: c.what || [],
        stamp: c.stamp || c.what || [],
        keywords: c.keywords || q.keywords || [],
        year: q.year,
        exam: q.exam,
        sourceCategory: q.sourceCategory || ''
    };
}
