import Button from "./components/button.js";
import Card from "./components/card.js";

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8000/subjects", { method: "GET" })
    .then((response) => response.json())
    .then((subjects) => {
      const containerRow = document.querySelector(".row");
      subjects.forEach((subject) => {
        const card = new Card(subject.name);

        const deleteCard = (event) => {
          fetch(`http://localhost:8000/subjects/${subject.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to delete subject");
              }
              const buttonCard = event.target.closest(".col-md-3");
              buttonCard.remove();
            })
            .catch((error) => {
              console.error(error);
            });
        };

        const deleteButton = new Button({
          buttonText: "Delete",
          buttonClass: "btn-danger",
          onclick: deleteCard,
        });

        card.element
          .querySelector(".card-body")
          .appendChild(deleteButton.button);
        containerRow.appendChild(card.element);
      });
    });
});
