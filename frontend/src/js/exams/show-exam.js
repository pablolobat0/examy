import { handleResponse, logError } from "../utils/errorHandling.js";

const getQuestions = async (examId) => {
  try {
    const response = await fetch(
      `http://localhost:8000/exams/${examId}/questions`,
      {
        method: "GET",
      },
    );

    const questions = await handleResponse(response);
    return questions;
  } catch (error) {
    logError(error);
  }
};

const getAnswers = async (questionId) => {
  try {
    const response = await fetch(
      `http://localhost:8000/questions/${questionId}/answers`,
      { method: "GET" },
    );
    const answers = await handleResponse(response);
    return answers;
  } catch (error) {
    logError(error);
  }
};

const renderAnswer = (answer, cardQuestion) => {
  const answerInput = document.createElement("input");
  answerInput.classList.add("form-check-input");
  answerInput.type = "radio";
  answerInput.name = `question_${answer.questionId}`;
  answerInput.value = answer.text;

  const answerLabel = document.createElement("label");
  answerLabel.classList.add("form-check-label");
  answerLabel.innerText = answer.text;

  const answerWrapper = document.createElement("div");
  answerWrapper.classList.add("form-check");
  answerLabel.appendChild(answerInput);
  answerWrapper.appendChild(answerLabel);

  cardQuestion.querySelector(".form-group").appendChild(answerWrapper);
};

const container = document.querySelector(".row");

const renderQuestion = async (question, answers) => {
  const cardQuestion = document.createElement("div");
  cardQuestion.classList.add("card", "mb-3");
  cardQuestion.innerHTML = `
        <div class="card-body">
          <p class="card-text">${question.statement}</p>
          <div class="form-group">
          </div>
        </div>`;

  answers.forEach((answer) => {
    renderAnswer(answer, cardQuestion);
  });
  container.appendChild(cardQuestion);
};

const checkAnswers = (correctAnswers) => {
  const radioButtons = document.querySelectorAll('input[type="radio"]');

  radioButtons.forEach((radioButton) => {
    const questionIndex = radioButton.getAttribute("name").split("_")[1]; // Obtenemos el índice de la pregunta
    const selectedAnswer = radioButton.value;
    const isCorrect = correctAnswers[questionIndex] === selectedAnswer;

    radioButton.parentElement.classList.remove("text-danger");
    if (isCorrect) {
      radioButton.parentElement.classList.add("text-success");
    } else if (radioButton.checked) {
      radioButton.parentElement.classList.add("text-danger");
    }
  });
};

const renderButtons = async (correctAnswers) => {
  const checkAnswersButton = document.getElementById("checkAnswersButton");

  checkAnswersButton.onclick = () => {
    checkAnswers(correctAnswers);
  };
};

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const examId = urlParams.get("examId");

  const correctAnswers = {};

  const questions = await getQuestions(examId);

  questions.forEach(async (question) => {
    const answers = await getAnswers(question.id);
    correctAnswers[question.id] = answers.filter(
      (answer) => answer.correct,
    )[0].text;
    renderQuestion(question, answers);
  });

  renderButtons(correctAnswers);
});
