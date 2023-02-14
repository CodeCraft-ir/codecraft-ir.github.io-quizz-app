async function getQuestions(num) {
  const baseUrl = "https://opentdb.com/api.php?amount=";
  const qlist = await fetch("https://opentdb.com/api.php?amount=" + num)
    .then((res) => res.json())
    .then((response) => response["results"])
    .catch((er) => console.log(er));
  return qlist;
}
let score = 0;
const questionsNumber = 5;
const questions = await getQuestions(questionsNumber);
const qTemplate = document.getElementById("question").innerHTML;
const answerTemplate = document.getElementById("answer").innerHTML;
const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());

function insertQuestion(qId) {
  const q = questions[qId];
  const questionsEl = document.querySelector(".questions");
  let newQuestionEl = qTemplate;
  let answers = [];
  for (const answer of q.incorrect_answers) {
    answers.push(answer);
  }
  answers.push(q.correct_answer);
  shuffle(answers);
  newQuestionEl = newQuestionEl.replaceAll("%%id%%", qId);
  newQuestionEl = newQuestionEl.replaceAll("%%title%%", q.question);
  newQuestionEl = document
    .createRange()
    .createContextualFragment(newQuestionEl);
  for (const answer of answers) {
    let answerEl = answerTemplate;
    answerEl = answerEl.replaceAll("%%id%%", qId);
    answerEl = answerEl.replaceAll("%%answer%%", answer);
    answerEl = document.createRange().createContextualFragment(answerEl);
    newQuestionEl.querySelector(".answers").appendChild(answerEl);
  }
  questionsEl.appendChild(newQuestionEl);
}
await insertQuestion(0);
document.querySelector(".loading").classList.add("hidden")
document.getElementsByName("answer").addEvent;

window.checkAnswer = function checkAnswer(a) {
  const qId = a.getAttribute("data-target");
  if (questions[qId].correct_answer == a.textContent.trim()) {
    a.classList.add("bg-green-500");
    score++;
  } else {
    document.querySelectorAll('[data-target="' + qId + '"]').forEach((ans) => {
      if (ans.textContent.trim() == questions[qId].correct_answer) {
        ans.classList.add("bg-green-500");
      }
    });
    a.classList.add("bg-red-500");
  }
  document.querySelector('[data-id="' + qId + '"]').classList.add("opacity-30");
  const newxQId = parseInt(qId) + 1;
  if (!questions[newxQId]) {
    document.querySelector(".finish").classList.remove("hidden");
    console.log(score);
    document.querySelector(".scoreNum").textContent = score;
    return;
  }
  insertQuestion(newxQId);
  document
    .querySelector('[data-id="' + newxQId + '"]')
    .scrollIntoView({ behavior: "smooth", block: "center" });
};

document.querySelector(".refresh").addEventListener("click", () => {
  window.location.reload();
});
