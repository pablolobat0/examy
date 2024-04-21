import { handleResponse, logError } from "../utils/errorHandling.js";

const ALERT_ID = "alert";

const createSubject = async (name) => {
  try {
    const response = await fetch("http://localhost:8000/subjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    await handleResponse(response);
    window.location.href = "../../../public/index.html";
  } catch (error) {
    logError(error, ALERT_ID);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createSubject");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    const formData = new FormData(form);
    const name = formData.get("subjectName");
    createSubject(name);
  });
});
