const ROTATION_INTERVAL_MS = 5 * 60 * 1000;

const mindsetMessages = [
  "세상엔 그냥 되는 게 절대 없다. 먹는 것, 자는 것, 집중한 것, 내가 어떻게 했느냐에 따라 결과가 달라질 수 있다.",
  "놀 거 다 놀고, 자기 하고 싶은 거 다 하면서 내가 원하는 것을 얻을 거라 생각하지 않는다. 지금 그런 투자가 없으면 절대 미래는 없다.",
  "준비가 잘 됐을 때의 공부 과정과 조금이라도 소홀했던 공부 준비 과정에서 학습력은 엄청난 차이가 난다.",
  "공부를 할 수 있는 지금이 가장 행복할 때다. 누군가는 이 공부를 하고 싶어도 기회조차 주어지지 않았을 것이다.",
  "하루하루를 살얼음판 걷듯, 돌다리 두들기듯, 정말 집중해서 살아가자. 하늘이 주신 기적 같은 기회다. 항상 감사하자.",
  "나는 프로다. 공부할 때 있어서는 한 치의 양보도 없다. 프로의 자세로 공부에 임하자.",
  "인무원려 필유근우 - 멀리 보지 않으면 가까이 근심이 있다.",
  "지금 이 시간, 순간은 내 인생에서 다시 돌아오지 않는다. 정말 소중하고 귀한 시간이다.",
  "더 이상 남들이 너를 뒷바라지 하느라 고생하지 않게 해라. - 전효진",
  "기간이 길어질수록 부모님은 덥고 추운 환경에서 힘들게 일하게 된다.",
  "오늘의 집중 1시간이 내일의 불안 10시간을 줄여 준다. 지금 바로 책상 앞에 앉자.",
  "머리가 아니라 습관이 합격을 만든다. 작은 약속을 지키는 사람이 끝까지 간다.",
  "포기하고 싶은 순간이 바로 남들과 격차를 벌릴 수 있는 결정적 순간이다.",
  "미래의 나를 살리는 건 지금의 나다. 핑계보다 실행을 먼저 선택하자.",
  "감정은 흔들려도 루틴은 흔들리지 않게, 오늘 정한 분량을 끝내자."
];

const messageEl = document.getElementById("mindset-text");
let currentMessageIndex = 0;

function renderMessage(nextIndex) {
  messageEl.classList.add("fade");

  setTimeout(() => {
    messageEl.textContent = mindsetMessages[nextIndex];
    messageEl.classList.remove("fade");
  }, 180);
}

function rotateMessage() {
  currentMessageIndex = (currentMessageIndex + 1) % mindsetMessages.length;
  renderMessage(currentMessageIndex);
}

function setInitialMessage() {
  messageEl.textContent = mindsetMessages[currentMessageIndex];
}

setInitialMessage();
setInterval(rotateMessage, ROTATION_INTERVAL_MS);
