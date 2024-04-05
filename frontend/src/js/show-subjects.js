import Button from "./components/button.js";
import Card from "./components/card.js";

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8000/subjects", { method: "GET" })
    .then((response) => response.json())
    .then((subjects) => {
      const containerRow = document.querySelector(".row");
      subjects.forEach((subject) => {
        const card = new Card(subject.name);

        containerRow.appendChild(card.element);
      });
    });
});
