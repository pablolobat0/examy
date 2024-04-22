import { handleResponse, logError } from "../utils/errorHandling.js";

const ALERT_ID = "alert";

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
    if (selectedValue == "pass") {
      return;
    }
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
});
