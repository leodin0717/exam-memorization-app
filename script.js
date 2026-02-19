const ROTATION_INTERVAL_MS = 5 * 60 * 1000;

const mindsetMessages = [
  "세상엔 그냥 되는 게 절대 없다. 먹는 것, 자는 것, 집중한 것, 내가 어떻게 했느냐에 따라 결과가 달라질 수 있다.",
  "놀 거 다 놀고, 자기 하고 싶은 거 다 하면서 내가 원하는 것을 얻을 거라 생각하지 않는다.",
  "준비가 잘 됐을 때의 공부 과정과 조금이라도 소홀했던 준비 과정은 학습력에서 큰 차이가 난다.",
  "더 이상 남들이 너를 뒷바라지 하느라 고생하지 않게 해라. - 전효진",
  "기간이 길어질수록 부모님은 덥고 추운 환경에서 힘들게 일하게 된다.",
  "미래의 나를 살리는 건 지금의 나다. 핑계보다 실행을 먼저 선택하자."
];

const integratedQuestions = [
  {
    sourceTitle: "2024 국가직 / 행정대집행",
    prompt: "다음 설명 중 옳은지 판단하시오.",
    choices: [
      {
        key: "ㄱ",
        text: "행정대집행의 대상은 대체적 작위의무 위반이다.",
        answer: true,
        explanation: "대집행은 대체적으로 이행 가능한 작위의무 불이행 시 가능하다.",
        highlightKeywords: ["행정대집행", "대체적", "작위의무"],
        memoryLine: "대집행은 '대체 가능한 작위'에만 꽂힌다.",
        memoryScene: "굴착기가 대신 담장을 세우는 장면을 떠올리면 '대체적 작위의무'가 바로 연결된다."
      },
      {
        key: "ㄴ",
        text: "행정대집행을 하기 위해서는 법원의 사전 허가가 반드시 필요하다.",
        answer: false,
        explanation: "행정대집행법상 법원의 사전 허가는 일반적 요건이 아니다.",
        highlightKeywords: ["법원의 사전 허가", "반드시 필요"],
        memoryLine: "대집행은 행정절차로 진행, 법원 선허가는 기본요건이 아니다.",
        memoryScene: "담당 공무원이 서류를 들고 바로 집행하는데, 판사 도장은 보이지 않는 장면을 기억하자."
      },
      {
        key: "ㄷ",
        text: "계고는 원칙적으로 상당한 이행기한을 정해 문서로 해야 한다.",
        answer: true,
        explanation: "계고는 의무 이행을 촉구하는 절차로, 원칙적으로 문서와 기한 설정이 필요하다.",
        highlightKeywords: ["계고", "상당한 이행기한", "문서"],
        memoryLine: "계고 = 문서 + 기한(카운트다운).",
        memoryScene: "노란 경고문에 '3일 내 이행'이 크게 찍혀 있는 장면을 머릿속에 붙여 두자."
      },
      {
        key: "ㄹ",
        text: "대집행 비용은 의무자가 부담하며, 징수할 수 있다.",
        answer: true,
        explanation: "대집행에 든 비용은 의무자로부터 징수 가능하다.",
        highlightKeywords: ["대집행 비용", "의무자 부담", "징수"],
        memoryLine: "누가 안 했나? 그 사람이 비용 낸다.",
        memoryScene: "집행 후 영수증이 바로 의무자 앞으로 발송되는 장면을 떠올리면 끝난다."
      }
    ]
  }
];

function expandIntegratedQuestions(questions) {
  return questions.flatMap((question) =>
    question.choices.map((choice) => ({
      sourceTitle: question.sourceTitle,
      prompt: question.prompt,
      statementKey: choice.key,
      statementText: choice.text,
      answer: choice.answer,
      explanation: choice.explanation,
      highlightKeywords: choice.highlightKeywords || [],
      memoryLine: choice.memoryLine || "",
      memoryScene: choice.memoryScene || ""
    }))
  );
}

const oxQuestions = expandIntegratedQuestions(integratedQuestions);

const mindsetTextEl = document.getElementById("mindset-text");
const progressTextEl = document.getElementById("progress-text");
const sourceTitleEl = document.getElementById("source-title");
const statementLabelEl = document.getElementById("statement-label");
const statementTextEl = document.getElementById("statement-text");
const memoryLineEl = document.getElementById("memory-line");
const feedbackEl = document.getElementById("feedback");

const btnO = document.getElementById("btn-o");
const btnX = document.getElementById("btn-x");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let currentMessageIndex = 0;
let currentQuestionIndex = 0;

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function highlightStatement(statementText, keywords) {
  if (!keywords.length) {
    return escapeHtml(statementText);
  }

  const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
  const escapedKeywords = sortedKeywords.map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const matcher = new RegExp(`(${escapedKeywords.join("|")})`, "g");

  return escapeHtml(statementText).replace(matcher, '<span class="keyword-highlight">$1</span>');
}

function renderKeywordChips(keywords) {
  if (!keywords.length) {
    return "";
  }

  return `
    <div class="keyword-chip-row" aria-label="핵심 키워드">
      ${keywords.map((keyword) => `<span class="keyword-chip">${escapeHtml(keyword)}</span>`).join("")}
    </div>
  `;
}

function rotateMindsetMessage() {
  currentMessageIndex = (currentMessageIndex + 1) % mindsetMessages.length;
  mindsetTextEl.textContent = mindsetMessages[currentMessageIndex];
}

function setInitialMindset() {
  mindsetTextEl.textContent = mindsetMessages[currentMessageIndex];
}

function renderQuestion() {
  const question = oxQuestions[currentQuestionIndex];
  progressTextEl.textContent = `${currentQuestionIndex + 1} / ${oxQuestions.length}`;
  sourceTitleEl.textContent = `${question.sourceTitle} · ${question.prompt}`;
  statementLabelEl.textContent = `${question.statementKey} 선지`;
  statementTextEl.innerHTML = highlightStatement(question.statementText, question.highlightKeywords);
  memoryLineEl.textContent = `🧠 암기 한 줄: ${question.memoryLine}`;
  feedbackEl.hidden = true;
  feedbackEl.className = "feedback";
  feedbackEl.innerHTML = "";

  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex === oxQuestions.length - 1;
}

function showFeedback(userAnswer) {
  const question = oxQuestions[currentQuestionIndex];
  const isCorrect = userAnswer === question.answer;
  feedbackEl.hidden = false;
  feedbackEl.classList.add(isCorrect ? "correct" : "wrong");

  feedbackEl.innerHTML = `
    <p class="feedback-title">${isCorrect ? "정답" : "오답"} · ${question.statementKey} 선지는 ${question.answer ? "O" : "X"}</p>
    <p>${escapeHtml(question.explanation)}</p>
    ${renderKeywordChips(question.highlightKeywords)}
    <p class="memory-scene">🎬 기억 장면: ${escapeHtml(question.memoryScene)}</p>
  `;
}

btnO.addEventListener("click", () => showFeedback(true));
btnX.addEventListener("click", () => showFeedback(false));

prevBtn.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex -= 1;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentQuestionIndex < oxQuestions.length - 1) {
    currentQuestionIndex += 1;
    renderQuestion();
  }
});

setInitialMindset();
setInterval(rotateMindsetMessage, ROTATION_INTERVAL_MS);
renderQuestion();
