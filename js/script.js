// Quiz data - you can modify/add questions here
const quizData = [
  {
    id: 1,
    type: "single", // "single" or "multi"
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    answer: [3] // indexes of correct options
  },
  {
    id: 2,
    type: "multi",
    question: "Select the fruits from the list:",
    options: ["Apple", "Carrot", "Banana", "Potato"],
    answer: [0,2]
  },
  {
    id: 3,
    type: "single",
    question: "HTML stands for?",
    options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "Hyperlinking Text Markup Language"],
    answer: [1]
  },
  {
    id: 4,
    type: "single",
    question: "Which tag is used to include JavaScript in HTML?",
    options: ["<script>", "<js>", "<code>", "<javascript>"],
    answer: [0]
  }
];

// State
let currentIndex = 0;
const userAnswers = Array(quizData.length).fill(null); // store arrays of selected indexes

// DOM refs
const questionBox = document.getElementById('question-box');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const result = document.getElementById('result');
const scoreText = document.getElementById('scoreText');
const restartBtn = document.getElementById('restartBtn');

function renderQuestion() {
  const q = quizData[currentIndex];
  questionBox.innerHTML = '';

  const qEl = document.createElement('div');
  qEl.className = 'question';
  qEl.innerHTML = `<strong>Question ${currentIndex + 1}:</strong> ${escapeHtml(q.question)}`;

  const optionsEl = document.createElement('ul');
  optionsEl.className = 'options';

  q.options.forEach((opt, idx) => {
    const li = document.createElement('li');
    li.className = 'option';
    li.dataset.index = idx;

    // choose input type
    const inputType = q.type === 'multi' ? 'checkbox' : 'radio';
    const input = document.createElement('input');
    input.type = inputType;
    input.name = 'option';
    input.id = `opt-${idx}`;
    input.checked = Array.isArray(userAnswers[currentIndex]) && userAnswers[currentIndex].includes(idx);

    const label = document.createElement('label');
    label.htmlFor = `opt-${idx}`;
    label.innerText = opt;

    // click handlers: mark selection
    li.addEventListener('click', (e) => {
      // prevent double toggle from clicking input
      if (q.type === 'multi') {
        toggleMulti(idx);
      } else {
        setSingle(idx);
      }
      renderQuestion();
    });

    li.appendChild(input);
    li.appendChild(label);

    // visual selected state
    if (Array.isArray(userAnswers[currentIndex]) && userAnswers[currentIndex].includes(idx)) {
      li.classList.add('selected');
      input.checked = true;
    }

    optionsEl.appendChild(li);
  });

  questionBox.appendChild(qEl);
  questionBox.appendChild(optionsEl);

  // button visibility
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === quizData.length - 1;
}

function setSingle(idx) {
  userAnswers[currentIndex] = [idx];
}

function toggleMulti(idx) {
  if (!Array.isArray(userAnswers[currentIndex])) userAnswers[currentIndex] = [];
  const pos = userAnswers[currentIndex].indexOf(idx);
  if (pos === -1) userAnswers[currentIndex].push(idx);
  else userAnswers[currentIndex].splice(pos,1);
}

function nextQuestion() {
  if (currentIndex < quizData.length - 1) currentIndex++;
  renderQuestion();
}

function prevQuestion() {
  if (currentIndex > 0) currentIndex--;
  renderQuestion();
}

function submitQuiz() {
  // Simple validation: ensure all answered
  for (let i = 0; i < quizData.length; i++) {
    if (!Array.isArray(userAnswers[i]) || userAnswers[i].length === 0) {
      if (!confirm(`Question ${i+1} is unanswered. Submit anyway?`)) {
        currentIndex = i;
        renderQuestion();
        return;
      } else {
        break;
      }
    }
  }

  // scoring: full credit only if selections exactly match the answer
  let score = 0;
  quizData.forEach((q, idx) => {
    const correct = Array.isArray(q.answer) ? q.answer.slice().sort().toString() : [q.answer].toString();
    const user = Array.isArray(userAnswers[idx]) ? userAnswers[idx].slice().sort().toString() : ''.toString();
    if (correct === user) score++;
  });

  showResults(score);
}

function showResults(score) {
  document.getElementById('quiz-area').classList.add('hidden');
  result.classList.remove('hidden');
  scoreText.innerText = `You scored ${score} out of ${quizData.length}.`;
}

function restart() {
  currentIndex = 0;
  for (let i=0;i<userAnswers.length;i++) userAnswers[i] = null;
  result.classList.add('hidden');
  document.getElementById('quiz-area').classList.remove('hidden');
  renderQuestion();
}

function escapeHtml(unsafe) {
  return unsafe.replace(/[&<"'>]/g, function(m) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#039;'}[m]; });
}

// event listeners
prevBtn.addEventListener('click', prevQuestion);
nextBtn.addEventListener('click', nextQuestion);
submitBtn.addEventListener('click', submitQuiz);
restartBtn.addEventListener('click', restart);

// initial render
renderQuestion();
