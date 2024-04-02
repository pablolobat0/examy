document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8000/subjects", { method: "GET" })
    .then((response) => response.json())
    .then((subjects) => {
      const select = document.getElementById("selectSubject");
      subjects.forEach((subject) => {
        const optionElement = document.createElement("option");
        optionElement.value = subject.id;
        optionElement.textContent = subject.name;
        select.appendChild(optionElement);
      });
    });

    const form = document.getElementById("createExam")

    form.addEventListener("submit", () => {

    })
});
