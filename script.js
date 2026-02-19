const ROTATION_INTERVAL_MS = 5 * 60 * 1000;

const mindsetMessages = [
  "세상엔 그냥 되는 게 절대 없다. 먹는 것, 자는 것, 집중한 것, 내가 어떻게 했느냐에 따라 결과가 달라질 수 있다.",
  "놀 거 다 놀고, 자기 하고 싶은 거 다 하면서 내가 원하는 것을 얻을 거라 생각하지 않는다. 지금 그런 투자가 없으면 절대 미래는 없다.",
  "준비가 잘 됐을 때의 공부 과정과 조금이라도 소홀했던 준비 과정은 학습력에서 큰 차이가 난다.",
  "공부를 할 수 있는 지금이 가장 행복할 때다. 누군가는 이 공부를 하고 싶어도 기회조차 주어지지 않았을 것이다.",
  "하루하루를 살얼음판 걷듯, 돌다리 두들기듯, 정말 집중해서 살아가자. 하늘이 주신 기적 같은 기회다. 항상 감사하자.",
  "나는 프로다. 공부할 때 있어서 만큼은 한치의 양보도 없다. 프로의 자세로 공부에 임하자.",
  "인무원여 필유근우 - 멀리 보지 않으면 가까이 근심이 있다.",
  "지금 이 시간, 순간은 내 인생에서 다시 돌아오지 않는다. 정말 소중하고 귀한 시간이다.",
  "더 이상 남들이 너를 뒷바라지 하느라 고생하지 않게 해라-전효진",
  "기간이 길어질 수록 부모님은 덥고 추운 환경에서 힘들게 일하게 된다",
  "미래의 나를 살리는 건 지금의 나다. 핑계보다 실행을 먼저 선택하자."
];

const integratedQuestions = [
  {
    sourceTitle: "2025 국가직7급 / 행정심판·행정소송",
    prompt: "다음 설명 중 옳은지 판단하시오.",
    choices: [
      {
        key: "ㄱ",
        text: "행정청이 법정 심판청구기간보다 긴 기간으로 잘못 통지한 경우의 신뢰 보호는 행정심판뿐 아니라 행정소송을 제기한 경우에까지 확대된다.",
        answer: false,
        explanation:
          "신뢰보호의 확장은 원칙적으로 행정심판 절차와 관련된 범위에서 논의되며, 행정소송 제기기간까지 당연히 확대된다고 볼 수 없다.",
        highlightKeywords: ["행정청", "기간", "잘못 통지", "신뢰보호", "심판뿐 아니라", "행정소송", "까지"],
        memoryLine:
          "🧠 한 줄 기억: 🏛️행정청 → ⏳긴 기간 오통지 → 🛡️신뢰보호는 심판선까지, ⚖️소송까지는 자동확장 X",
        memoryScene:
          "🎬 3초 숏폼: 네온비 내리는 광화문 한복판, 하늘에서 찢어진 관보가 쇳소리와 함께 바닥을 찍고(원인), 그 충격파가 행정심판 문 앞까지는 파랗게 번지지만 행정소송 문턱에서 얼음벽에 부딪혀 산산이 깨진다(결과). 코끝엔 탄 종이 냄새, 귀엔 째깍 경보음."
      },
      {
        key: "ㄴ",
        text: "행정대집행의 대상은 대체적 작위의무 위반이다.",
        answer: true,
        explanation: "대집행은 대체적으로 이행 가능한 작위의무 불이행 시 가능하다.",
        highlightKeywords: ["행정대집행", "대체적", "작위의무"],
        memoryLine: "🧠 한 줄 기억: 🏗️대집행은 🔁대체 가능한 ✍️작위의무 위반에만 작동!"
      },
      {
        key: "ㄷ",
        text: "계고는 원칙적으로 상당한 이행기한을 정해 문서로 해야 한다.",
        answer: true,
        explanation: "계고는 의무 이행을 촉구하는 절차로, 원칙적으로 문서와 기한 설정이 필요하다.",
        highlightKeywords: ["계고", "상당한 이행기한", "문서"],
        memoryLine: "🧠 한 줄 기억: 📄계고는 ⏰기한을 박아 ✉️문서로 남긴다."
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
      highlightKeywords: choice.highlightKeywords ?? [],
      memoryLine: choice.memoryLine ?? "",
      memoryScene: choice.memoryScene ?? ""
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

function rotateMindsetMessage() {
  currentMessageIndex = (currentMessageIndex + 1) % mindsetMessages.length;
  mindsetTextEl.textContent = mindsetMessages[currentMessageIndex];
}

function setInitialMindset() {
  mindsetTextEl.textContent = mindsetMessages[currentMessageIndex];
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function highlightStatement(text, keywords) {
  if (!keywords.length) {
    return escapeHtml(text);
  }

  const segments = [];
  let cursor = 0;

  keywords.forEach((keyword) => {
    const matchIndex = text.indexOf(keyword, cursor);
    if (matchIndex === -1) {
      return;
    }

    if (matchIndex > cursor) {
      segments.push({ text: text.slice(cursor, matchIndex), highlighted: false });
    }

    segments.push({ text: text.slice(matchIndex, matchIndex + keyword.length), highlighted: true });
    cursor = matchIndex + keyword.length;
  });

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), highlighted: false });
  }

  return segments
    .map((segment) => {
      const safeText = escapeHtml(segment.text);
      return segment.highlighted ? `<mark class="keyword-highlight">${safeText}</mark>` : safeText;
    })
    .join("");
}

function renderQuestion() {
  const question = oxQuestions[currentQuestionIndex];
  progressTextEl.textContent = `${currentQuestionIndex + 1} / ${oxQuestions.length}`;
  sourceTitleEl.textContent = `${question.sourceTitle} · ${question.prompt}`;
  statementLabelEl.textContent = `${question.statementKey} 선지`;
  statementTextEl.innerHTML = highlightStatement(question.statementText, question.highlightKeywords);
  memoryLineEl.textContent = question.memoryLine;
  feedbackEl.hidden = true;
  feedbackEl.className = "feedback";
  feedbackEl.innerHTML = "";

  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex === oxQuestions.length - 1;
}

function keywordChips(keywords) {
  return keywords
    .map((keyword) => `<span class="keyword-chip">✨ ${escapeHtml(keyword)}</span>`)
    .join("");
}

function showFeedback(userAnswer) {
  const question = oxQuestions[currentQuestionIndex];
  const isCorrect = userAnswer === question.answer;
  const answerText = question.answer ? "O" : "X";

  feedbackEl.hidden = false;
  feedbackEl.classList.add(isCorrect ? "correct" : "wrong");
  feedbackEl.innerHTML = `
    <p class="feedback-title">${isCorrect ? "정답!" : "오답!"} ${question.statementKey} 선지는 ${answerText} 입니다.</p>
    <p>${escapeHtml(question.explanation)}</p>
    <div class="keyword-chip-row">${keywordChips(question.highlightKeywords)}</div>
    ${question.memoryScene ? `<p class="memory-scene">${escapeHtml(question.memoryScene)}</p>` : ""}
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
