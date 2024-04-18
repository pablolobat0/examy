import View from "./view.js";

document.addEventListener("DOMContentLoaded", () => {
  const view = new View();
  fetch("http://localhost:8000/subjects", { method: "GET" })
    .then((response) => response.json())
    .then((subjects) => {
      subjects.forEach((subject) => {
        view.createSubject(subject);
      });
    });
});
