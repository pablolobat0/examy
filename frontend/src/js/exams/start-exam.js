import { handleResponse, logError } from "../utils/errorHandling.js";

const ALERT_ID = "alert";
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
  answerWrapper.appendChild(answerInput);
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

const getSubjects = async () => {
  try {
    const response = await fetch("http://localhost:8000/subjects", {
      method: "GET",
    });
    const subjects = await handleResponse(response);
    return subjects;
  } catch (error) {
    logError(error, ALERT_ID);
  }
};

const renderSubjects = (select, subjects) => {
  subjects.forEach((subject) => {
    const optionElement = document.createElement("option");
    optionElement.value = subject.id;
    optionElement.textContent = subject.name;
    select.appendChild(optionElement);
  });
};

const renderNumberOfQuestion = (numberOfQuestions) => {
  const rangeInput = document.getElementById("rangeInput");
  rangeInput.max = numberOfQuestions;

  const rangeValue = document.getElementById("rangeValue");
  rangeInput.addEventListener("change", () => {
    rangeValue.textContent = rangeInput.value;
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const subjects = await getSubjects();
  const select = document.getElementById("selectSubject");
  renderSubjects(select, subjects);

  select.addEventListener("change", async (event) => {
    const selectedValue = event.target.value;
    try {
      const response = await fetch(
        `http://localhost:8000/subjects/${selectedValue}/exams/questions/count`,
        {
          method: "GET",
        },
      );
      const numberOfQuestions = await handleResponse(response);
      renderNumberOfQuestion(numberOfQuestions);
    } catch (error) {
      logError(error, ALERT_ID);
    }
  });

  const form = document.getElementById("startExam");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const rangeInput = document.getElementById("rangeInput");
      const response = await fetch(
        `http://localhost:8000/subjects/${select.value}/exams/questions?numberOfQuestions=${rangeInput.value}`,
        { method: "GET" },
      );
      let correctAnswers = [];
      form.classList.add("d-none");
      const questions = await handleResponse(response);
      questions.forEach(async (question) => {
        const answers = await getAnswers(question.id);
        correctAnswers[question.id] = answers.filter(
          (answer) => answer.correct,
        )[0].text;
        renderQuestion(question, answers);
      });
      const button = document.getElementById("checkAnswersButton");
      button.classList.remove("d-none");
      renderButtons(correctAnswers);
    } catch (error) {
      logError(error, ALERT_ID);
    }
  });
});
