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
        explanation: "대집행은 대체적으로 이행 가능한 작위의무 불이행 시 가능하다."
      },
      {
        key: "ㄴ",
        text: "행정대집행을 하기 위해서는 법원의 사전 허가가 반드시 필요하다.",
        answer: false,
        explanation: "행정대집행법상 법원의 사전 허가는 일반적 요건이 아니다."
      },
      {
        key: "ㄷ",
        text: "계고는 원칙적으로 상당한 이행기한을 정해 문서로 해야 한다.",
        answer: true,
        explanation: "계고는 의무 이행을 촉구하는 절차로, 원칙적으로 문서와 기한 설정이 필요하다."
      },
      {
        key: "ㄹ",
        text: "대집행 비용은 의무자가 부담하며, 징수할 수 있다.",
        answer: true,
        explanation: "대집행에 든 비용은 의무자로부터 징수 가능하다."
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
      explanation: choice.explanation
    }))
  );
}

const oxQuestions = expandIntegratedQuestions(integratedQuestions);

const mindsetTextEl = document.getElementById("mindset-text");
const progressTextEl = document.getElementById("progress-text");
const sourceTitleEl = document.getElementById("source-title");
const statementLabelEl = document.getElementById("statement-label");
const statementTextEl = document.getElementById("statement-text");
const feedbackEl = document.getElementById("feedback");

const btnO = document.getElementById("btn-o");
const btnX = document.getElementById("btn-x");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let currentMessageIndex = 0;
let currentQuestionIndex = 0;

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
  statementTextEl.textContent = question.statementText;
  feedbackEl.hidden = true;
  feedbackEl.className = "feedback";

  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex === oxQuestions.length - 1;
}

function showFeedback(userAnswer) {
  const question = oxQuestions[currentQuestionIndex];
  const isCorrect = userAnswer === question.answer;
  feedbackEl.hidden = false;
  feedbackEl.classList.add(isCorrect ? "correct" : "wrong");
  feedbackEl.textContent = isCorrect
    ? `정답! ${question.statementKey} 선지는 ${question.answer ? "O" : "X"} 입니다. ${question.explanation}`
    : `오답! ${question.statementKey} 선지는 ${question.answer ? "O" : "X"} 입니다. ${question.explanation}`;
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
