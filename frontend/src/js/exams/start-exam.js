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

const renderButtons = async (correctAnswers, numberOfQuestions) => {
  const checkAnswersButton = document.createElement("button");
  checkAnswersButton.classList.add("btn", "btn-primary");
  checkAnswersButton.innerText = "Comprobar respuestas";

  checkAnswersButton.onclick = () => {
    checkAnswers(correctAnswers, numberOfQuestions);
    checkAnswersButton.remove();
  };

  const checkAnswersButtonContainer = document.getElementById(
    "checkAnswersButtonContainer",
  );

  checkAnswersButtonContainer.appendChild(checkAnswersButton);
};

const uncheckAnswers = () => {
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((radioButton) => {
    radioButton.checked = false;
    radioButton.parentElement.classList.remove("text-danger");
    radioButton.parentElement.classList.remove("text-success");
  });
};

const renderResult = (
  numberOfQuestions,
  numberOfCorrectAnswers,
  correctAnswers,
) => {
  const resultCard = document.createElement("div");
  resultCard.classList.add("col-md-6", "mb-3");
  const grade = (numberOfCorrectAnswers * 10) / numberOfQuestions;
  resultCard.innerHTML = `<div class="card">
                              <div class="card-body">
                                <h5 class="card-title text-center">Resultado del examen</h5>
                                <ul class="list-group list-group-light list-group-small">
                                    <li class="list-group-item px-3">Preguntas: ${numberOfQuestions}</li>
                                    <li class="list-group-item px-3">Aciertos: ${numberOfCorrectAnswers}</li>
                                    <li class="list-group-item px-3">Nota: ${grade.toFixed(2)}</li>
                                </ul>
                              </div>
                         </div>`;

  const repeatExamButton = document.createElement("button");
  repeatExamButton.classList.add("btn", "btn-primary", "mt-3", "me-2");
  repeatExamButton.onclick = () => {
    uncheckAnswers();
    resultCard.remove();
    renderButtons(correctAnswers, numberOfQuestions);
  };
  repeatExamButton.innerText = "Repetir examen";

  const otherExamButton = document.createElement("button");
  otherExamButton.classList.add("btn", "btn-primary", "mt-3", "ms-2");
  otherExamButton.onclick = () => location.reload();
  otherExamButton.innerText = "Hacer otro examen";

  resultCard.querySelector(".card-body").appendChild(repeatExamButton);
  resultCard.querySelector(".card-body").appendChild(otherExamButton);
  const container = document.getElementById("resultContainer");
  container.append(resultCard);
  resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
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

const container = document.getElementById("examsContainer");

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

function checkAnswers(correctAnswers, numberOfQuestions) {
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  let numberOfCorrectAnswers = 0;
  radioButtons.forEach((radioButton) => {
    const questionIndex = radioButton.getAttribute("name").split("_")[1]; // Obtenemos el índice de la pregunta
    const selectedAnswer = radioButton.value;
    const isCorrect = correctAnswers[questionIndex] === selectedAnswer;

    radioButton.parentElement.classList.remove("text-danger");
    if (isCorrect) {
      if (radioButton.checked) {
        numberOfCorrectAnswers++;
      }
      radioButton.parentElement.classList.add("text-success");
    } else if (radioButton.checked) {
      radioButton.parentElement.classList.add("text-danger");
    }
  });
  renderResult(numberOfQuestions, numberOfCorrectAnswers, correctAnswers);
}

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
      renderButtons(correctAnswers, rangeInput.value);
    } catch (error) {
      logError(error, ALERT_ID);
    }
  });
});
