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

const renderSubjects = (subjects) => {
  const select = document.getElementById("selectSubject");
  subjects.forEach((subject) => {
    const optionElement = document.createElement("option");
    optionElement.value = subject.id;
    optionElement.textContent = subject.name;
    select.appendChild(optionElement);
  });
};

const createExam = async (formData) => {
  try {
    const response = await fetch("http://localhost:8000/exams", {
      method: "POST",
      body: formData,
    });
    await handleResponse(response);
    window.location.href = "../../../public/index.html";
  } catch (error) {
    logError(error, ALERT_ID);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const subjects = await getSubjects();
  renderSubjects(subjects);

  const form = document.getElementById("createExam");

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    const select = document.getElementById("selectSubject");
    const formData = new FormData(form); // Crear objeto FormData con los datos del formulario
    // Convertir FormData a un objeto JSON
    formData.append("name", form.elements.examName.value);
    formData.append("subjectId", select.value);
    formData.append("file", form.elements.fileInput.files[0]);

    await createExam(formData);
  });
});
