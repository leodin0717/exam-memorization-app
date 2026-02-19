// 한국사 키워드 카드 생성 기본 데이터
const HISTORY_EXAM_DATE = '2026-04-05';

const HISTORY_SUBJECTS = {
  his: '한국사'
};

const HISTORY_ERAS = {
  prehistoric: '선사·고조선',
  ancient: '삼국·가야',
  nambuk: '남북국',
  goryeo: '고려',
  joseon_early: '조선 전기',
  joseon_late: '조선 후기',
  opening: '개항기',
  colonial: '일제강점기',
  modern: '현대'
};

const HISTORY_WEAK_TAGS = [
  { id: 'chronology', label: '연표 순서' },
  { id: 'concept', label: '개념 혼동' },
  { id: 'keyword', label: '핵심어 미회수' },
  { id: 'time', label: '시간압박' },
  { id: 'careless', label: '실수' }
];

const HISTORY_STOPWORDS = [
  '다음', '설명', '옳은', '옳지', '것', '가장', '대한', '으로', '있는', '없는',
  '시기', '사건', '내용', '자료', '밑줄', '기간', '왕', '나라', '관련', '해당'
];

const HISTORY_EVENTS = [
  { id: 'E001', name: '구석기 문화', year: -700000, era: 'prehistoric', importance: 'A', keywords: ['주먹도끼', '뗀석기', '이동생활'] },
  { id: 'E002', name: '신석기 문화', year: -8000, era: 'prehistoric', importance: 'S', keywords: ['빗살무늬토기', '정착', '농경'] },
  { id: 'E003', name: '청동기 문화 확산', year: -1500, era: 'prehistoric', importance: 'S', keywords: ['비파형동검', '고인돌', '계급'] },
  { id: 'E004', name: '철기 문화 보급', year: -400, era: 'prehistoric', importance: 'A', keywords: ['세형동검', '명도전', '중계무역'] },
  { id: 'E005', name: '고조선 건국(전통)', year: -2333, era: 'prehistoric', importance: 'A', keywords: ['단군', '건국신화'] },
  { id: 'E006', name: '위만 조선 성립', year: -194, era: 'prehistoric', importance: 'A', keywords: ['위만', '철기', '중계무역'] },
  { id: 'E007', name: '한사군 설치', year: -108, era: 'prehistoric', importance: 'S', keywords: ['낙랑군', '군현', '한무제'] },

  { id: 'E008', name: '고구려 건국', year: -37, era: 'ancient', importance: 'A', keywords: ['주몽', '졸본'] },
  { id: 'E009', name: '백제 건국', year: -18, era: 'ancient', importance: 'A', keywords: ['온조', '한성'] },
  { id: 'E010', name: '신라 건국', year: -57, era: 'ancient', importance: 'A', keywords: ['박혁거세', '사로국'] },
  { id: 'E011', name: '가야 연맹 성립', year: 42, era: 'ancient', importance: 'B', keywords: ['김수로왕', '금관가야'] },
  { id: 'E012', name: '고구려 태학 설립', year: 372, era: 'ancient', importance: 'A', keywords: ['소수림왕', '태학', '율령'] },
  { id: 'E013', name: '백제 불교 공인', year: 384, era: 'ancient', importance: 'B', keywords: ['침류왕', '불교'] },
  { id: 'E014', name: '신라 불교 공인', year: 527, era: 'ancient', importance: 'A', keywords: ['법흥왕', '이차돈'] },
  { id: 'E015', name: '광개토대왕 즉위', year: 391, era: 'ancient', importance: 'A', keywords: ['정복활동', '영토확장'] },
  { id: 'E016', name: '장수왕 평양 천도', year: 427, era: 'ancient', importance: 'S', keywords: ['남진정책', '평양'] },
  { id: 'E017', name: '백제 웅진 천도', year: 475, era: 'ancient', importance: 'A', keywords: ['공주', '한성 함락'] },
  { id: 'E018', name: '백제 사비 천도', year: 538, era: 'ancient', importance: 'A', keywords: ['성왕', '부여'] },
  { id: 'E019', name: '진흥왕 순수비 건립', year: 551, era: 'ancient', importance: 'A', keywords: ['화랑도', '한강'] },
  { id: 'E020', name: '살수대첩', year: 612, era: 'ancient', importance: 'S', keywords: ['을지문덕', '수나라'] },
  { id: 'E021', name: '안시성 전투', year: 645, era: 'ancient', importance: 'A', keywords: ['양만춘', '당태종'] },
  { id: 'E022', name: '백제 멸망', year: 660, era: 'ancient', importance: 'S', keywords: ['황산벌', '나당연합'] },
  { id: 'E023', name: '고구려 멸망', year: 668, era: 'ancient', importance: 'S', keywords: ['나당연합', '보장왕'] },
  { id: 'E024', name: '나당 전쟁', year: 670, era: 'ancient', importance: 'A', keywords: ['매소성', '기벌포'] },
  { id: 'E025', name: '통일 신라 완성', year: 676, era: 'ancient', importance: 'S', keywords: ['삼국통일', '문무왕'] },

  { id: 'E026', name: '발해 건국', year: 698, era: 'nambuk', importance: 'S', keywords: ['대조영', '동모산'] },
  { id: 'E027', name: '신문왕 관료전 지급', year: 689, era: 'nambuk', importance: 'A', keywords: ['관료전', '녹읍폐지'] },
  { id: 'E028', name: '신라 9주 5소경 정비', year: 685, era: 'nambuk', importance: 'A', keywords: ['지방행정', '9주'] },
  { id: 'E029', name: '장보고 청해진 설치', year: 828, era: 'nambuk', importance: 'A', keywords: ['해상무역', '청해진'] },
  { id: 'E030', name: '원종·애노의 난', year: 889, era: 'nambuk', importance: 'A', keywords: ['신라 하대', '농민봉기'] },

  { id: 'E031', name: '후고구려 건국', year: 901, era: 'goryeo', importance: 'B', keywords: ['궁예', '후삼국'] },
  { id: 'E032', name: '후백제 건국', year: 900, era: 'goryeo', importance: 'B', keywords: ['견훤', '후삼국'] },
  { id: 'E033', name: '고려 건국', year: 918, era: 'goryeo', importance: 'S', keywords: ['왕건', '송악'] },
  { id: 'E034', name: '후삼국 통일', year: 936, era: 'goryeo', importance: 'S', keywords: ['왕건', '일리천'] },
  { id: 'E035', name: '광종 과거제 실시', year: 958, era: 'goryeo', importance: 'S', keywords: ['쌍기', '과거제'] },
  { id: 'E036', name: '광종 노비안검법 시행', year: 956, era: 'goryeo', importance: 'S', keywords: ['노비안검법', '왕권강화'] },
  { id: 'E037', name: '성종 2성 6부 정비', year: 982, era: 'goryeo', importance: 'A', keywords: ['최승로', '유교정치'] },
  { id: 'E038', name: '서희의 외교 담판', year: 993, era: 'goryeo', importance: 'S', keywords: ['거란', '강동6주'] },
  { id: 'E039', name: '귀주대첩', year: 1019, era: 'goryeo', importance: 'S', keywords: ['강감찬', '거란'] },
  { id: 'E040', name: '이자겸의 난', year: 1126, era: 'goryeo', importance: 'A', keywords: ['문벌귀족'] },
  { id: 'E041', name: '묘청의 서경 천도 운동', year: 1135, era: 'goryeo', importance: 'A', keywords: ['서경', '묘청'] },
  { id: 'E042', name: '무신정변', year: 1170, era: 'goryeo', importance: 'S', keywords: ['정중부', '문벌붕괴'] },
  { id: 'E043', name: '망이·망소이의 난', year: 1176, era: 'goryeo', importance: 'B', keywords: ['농민봉기'] },
  { id: 'E044', name: '만적의 난', year: 1198, era: 'goryeo', importance: 'A', keywords: ['신분해방'] },
  { id: 'E045', name: '몽골 침입 시작', year: 1231, era: 'goryeo', importance: 'S', keywords: ['몽골', '강화천도'] },
  { id: 'E046', name: '강화도 천도', year: 1232, era: 'goryeo', importance: 'A', keywords: ['최우', '강화천도'] },
  { id: 'E047', name: '삼별초 항쟁', year: 1270, era: 'goryeo', importance: 'A', keywords: ['배중손', '진도', '제주'] },
  { id: 'E048', name: '원 간섭기 본격화', year: 1274, era: 'goryeo', importance: 'A', keywords: ['부마국', '정동행성'] },
  { id: 'E049', name: '공민왕 반원 자주 개혁', year: 1356, era: 'goryeo', importance: 'S', keywords: ['쌍성총관부', '친원파 숙청'] },
  { id: 'E050', name: '위화도 회군', year: 1388, era: 'goryeo', importance: 'S', keywords: ['이성계', '정변'] },
  { id: 'E051', name: '과전법 제정', year: 1391, era: 'goryeo', importance: 'A', keywords: ['신진사대부', '토지제도'] },

  { id: 'E052', name: '조선 건국', year: 1392, era: 'joseon_early', importance: 'S', keywords: ['이성계', '한양'] },
  { id: 'E053', name: '6조 직계제 시행', year: 1405, era: 'joseon_early', importance: 'A', keywords: ['태종', '왕권강화'] },
  { id: 'E054', name: '훈민정음 창제', year: 1443, era: 'joseon_early', importance: 'S', keywords: ['세종', '훈민정음'] },
  { id: 'E055', name: '훈민정음 해례 반포', year: 1446, era: 'joseon_early', importance: 'A', keywords: ['세종', '해례본'] },
  { id: 'E056', name: '농사직설 편찬', year: 1429, era: 'joseon_early', importance: 'A', keywords: ['세종', '농서'] },
  { id: 'E057', name: '경국대전 완성', year: 1485, era: 'joseon_early', importance: 'S', keywords: ['성종', '통치법전'] },
  { id: 'E058', name: '무오사화', year: 1498, era: 'joseon_early', importance: 'A', keywords: ['사림', '훈구'] },
  { id: 'E059', name: '갑자사화', year: 1504, era: 'joseon_early', importance: 'A', keywords: ['연산군'] },
  { id: 'E060', name: '중종반정', year: 1506, era: 'joseon_early', importance: 'A', keywords: ['중종', '반정'] },
  { id: 'E061', name: '기묘사화', year: 1519, era: 'joseon_early', importance: 'A', keywords: ['조광조'] },
  { id: 'E062', name: '을사사화', year: 1545, era: 'joseon_early', importance: 'A', keywords: ['명종'] },
  { id: 'E063', name: '임진왜란', year: 1592, era: 'joseon_early', importance: 'S', keywords: ['선조', '왜란', '이순신'] },
  { id: 'E064', name: '훈련도감 설치', year: 1593, era: 'joseon_early', importance: 'A', keywords: ['삼수병', '군제개편'] },
  { id: 'E065', name: '정유재란', year: 1597, era: 'joseon_early', importance: 'A', keywords: ['왜란', '명량'] },
  { id: 'E066', name: '비변사 기능 강화', year: 1600, era: 'joseon_early', importance: 'A', keywords: ['국정총괄', '왜란이후'] },
  { id: 'E067', name: '광해군 중립 외교', year: 1610, era: 'joseon_early', importance: 'A', keywords: ['중립외교', '명청교체'] },

  { id: 'E068', name: '인조반정', year: 1623, era: 'joseon_late', importance: 'A', keywords: ['서인', '광해군'] },
  { id: 'E069', name: '정묘호란', year: 1627, era: 'joseon_late', importance: 'S', keywords: ['후금', '화의'] },
  { id: 'E070', name: '병자호란', year: 1636, era: 'joseon_late', importance: 'S', keywords: ['청', '삼전도'] },
  { id: 'E071', name: '북벌론 제기', year: 1650, era: 'joseon_late', importance: 'A', keywords: ['효종', '북벌'] },
  { id: 'E072', name: '예송 논쟁', year: 1659, era: 'joseon_late', importance: 'A', keywords: ['서인', '남인', '예학'] },
  { id: 'E073', name: '대동법 전국 확대', year: 1708, era: 'joseon_late', importance: 'S', keywords: ['공납', '세제개편'] },
  { id: 'E074', name: '균역법 시행', year: 1750, era: 'joseon_late', importance: 'S', keywords: ['영조', '군포'] },
  { id: 'E075', name: '규장각 설치', year: 1776, era: 'joseon_late', importance: 'A', keywords: ['정조', '개혁'] },
  { id: 'E076', name: '장용영 설치', year: 1785, era: 'joseon_late', importance: 'A', keywords: ['정조', '왕권강화'] },
  { id: 'E077', name: '홍경래의 난', year: 1811, era: 'joseon_late', importance: 'A', keywords: ['평안도', '농민봉기'] },
  { id: 'E078', name: '세도 정치 심화', year: 1830, era: 'joseon_late', importance: 'S', keywords: ['안동 김씨', '삼정문란'] },
  { id: 'E079', name: '임술농민봉기', year: 1862, era: 'joseon_late', importance: 'A', keywords: ['삼정문란', '농민봉기'] },
  { id: 'E080', name: '흥선대원군 집권', year: 1863, era: 'joseon_late', importance: 'S', keywords: ['서원철폐', '경복궁중건'] },
  { id: 'E081', name: '병인양요', year: 1866, era: 'joseon_late', importance: 'A', keywords: ['프랑스', '외규장각'] },
  { id: 'E082', name: '신미양요', year: 1871, era: 'joseon_late', importance: 'A', keywords: ['미국', '광성보'] },

  { id: 'E083', name: '강화도 조약 체결', year: 1876, era: 'opening', importance: 'S', keywords: ['개항', '불평등조약'] },
  { id: 'E084', name: '통리기무아문 설치', year: 1880, era: 'opening', importance: 'A', keywords: ['개화정책'] },
  { id: 'E085', name: '임오군란', year: 1882, era: 'opening', importance: 'S', keywords: ['구식군인', '제물포조약'] },
  { id: 'E086', name: '갑신정변', year: 1884, era: 'opening', importance: 'S', keywords: ['급진개화파', '3일천하'] },
  { id: 'E087', name: '동학 농민 운동', year: 1894, era: 'opening', importance: 'S', keywords: ['전봉준', '집강소'] },
  { id: 'E088', name: '갑오개혁', year: 1894, era: 'opening', importance: 'S', keywords: ['군국기무처', '신분제폐지'] },
  { id: 'E089', name: '을미개혁', year: 1895, era: 'opening', importance: 'A', keywords: ['단발령', '태양력'] },
  { id: 'E090', name: '아관파천', year: 1896, era: 'opening', importance: 'A', keywords: ['러시아공사관'] },
  { id: 'E091', name: '독립협회 창립', year: 1896, era: 'opening', importance: 'A', keywords: ['만민공동회', '자주독립'] },
  { id: 'E092', name: '대한제국 수립', year: 1897, era: 'opening', importance: 'S', keywords: ['광무개혁', '고종'] },
  { id: 'E093', name: '을사늑약', year: 1905, era: 'opening', importance: 'S', keywords: ['외교권박탈', '통감부'] },
  { id: 'E094', name: '정미7조약', year: 1907, era: 'opening', importance: 'A', keywords: ['군대해산'] },
  { id: 'E095', name: '국권 피탈', year: 1910, era: 'opening', importance: 'S', keywords: ['한일병합', '식민지'] },

  { id: 'E096', name: '3·1 운동', year: 1919, era: 'colonial', importance: 'S', keywords: ['민족대표', '비폭력'] },
  { id: 'E097', name: '대한민국 임시정부 수립', year: 1919, era: 'colonial', importance: 'S', keywords: ['상하이', '임정'] },
  { id: 'E098', name: '의열단 조직', year: 1919, era: 'colonial', importance: 'A', keywords: ['김원봉', '의열투쟁'] },
  { id: 'E099', name: '봉오동 전투', year: 1920, era: 'colonial', importance: 'A', keywords: ['홍범도', '독립군'] },
  { id: 'E100', name: '청산리 대첩', year: 1920, era: 'colonial', importance: 'A', keywords: ['김좌진', '북로군정서'] },
  { id: 'E101', name: '물산 장려 운동', year: 1920, era: 'colonial', importance: 'B', keywords: ['평양', '민족경제'] },
  { id: 'E102', name: '형평 운동', year: 1923, era: 'colonial', importance: 'B', keywords: ['백정차별철폐'] },
  { id: 'E103', name: '6·10 만세 운동', year: 1926, era: 'colonial', importance: 'A', keywords: ['순종인산일'] },
  { id: 'E104', name: '신간회 창립', year: 1927, era: 'colonial', importance: 'A', keywords: ['민족유일당'] },
  { id: 'E105', name: '광주 학생 항일 운동', year: 1929, era: 'colonial', importance: 'A', keywords: ['학생운동', '민족운동'] },
  { id: 'E106', name: '한인애국단 조직', year: 1931, era: 'colonial', importance: 'A', keywords: ['김구', '이봉창', '윤봉길'] },
  { id: 'E107', name: '조선어학회 사건', year: 1942, era: 'colonial', importance: 'A', keywords: ['한글말살정책'] },
  { id: 'E108', name: '한국광복군 창설', year: 1940, era: 'colonial', importance: 'A', keywords: ['임시정부', '충칭'] },
  { id: 'E109', name: '건국준비위원회 조직', year: 1945, era: 'colonial', importance: 'A', keywords: ['여운형', '건준'] },

  { id: 'E110', name: '대한민국 정부 수립', year: 1948, era: 'modern', importance: 'S', keywords: ['제헌헌법', '정부수립'] },
  { id: 'E111', name: '6·25 전쟁 발발', year: 1950, era: 'modern', importance: 'S', keywords: ['한국전쟁', '유엔군'] },
  { id: 'E112', name: '4·19 혁명', year: 1960, era: 'modern', importance: 'S', keywords: ['이승만', '학생운동'] },
  { id: 'E113', name: '5·16 군사 정변', year: 1961, era: 'modern', importance: 'A', keywords: ['박정희'] },
  { id: 'E114', name: '유신 체제 성립', year: 1972, era: 'modern', importance: 'A', keywords: ['유신헌법'] },
  { id: 'E115', name: '5·18 민주화 운동', year: 1980, era: 'modern', importance: 'S', keywords: ['광주', '민주화'] },
  { id: 'E116', name: '6월 민주 항쟁', year: 1987, era: 'modern', importance: 'S', keywords: ['직선제', '민주화'] }
];

const HISTORY_CAUSE_EFFECT_MAP = {
  '임진왜란': ['훈련도감 설치', '비변사 기능 강화', '광해군 중립 외교'],
  '병자호란': ['북벌론 제기'],
  '강화도 조약 체결': ['통리기무아문 설치', '임오군란', '갑신정변'],
  '동학 농민 운동': ['갑오개혁', '을미개혁'],
  '을사늑약': ['정미7조약', '국권 피탈'],
  '3·1 운동': ['대한민국 임시정부 수립'],
  '대한민국 정부 수립': ['6·25 전쟁 발발'],
  '4·19 혁명': ['5·16 군사 정변'],
  '5·18 민주화 운동': ['6월 민주 항쟁']
};

const HISTORY_TEMPLATE_WEIGHTS = {
  auto: { after: 0.42, between: 0.28, sameEra: 0.18, cause: 0.12 },
  after: { after: 1 },
  between: { between: 1 },
  sameEra: { sameEra: 1 },
  cause: { cause: 1 }
};
