import Card from "../components/card.js";

export default class View {
  constructor() {}

  deleteSubject = async (subject) => {
    try {
      const response = await fetch(
        `http://localhost:8000/subjects/${subject.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to delete subject");
      }
      const buttonCard = document.getElementById(subject.id);
      buttonCard.remove();
    } catch (error) {
      console.error(error);
    }
  };
  createSubject = async (subject) => {
    const containerRow = document.querySelector(".row");
    const card = new Card(subject.id, subject.name);
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.onclick = () => {
      this.deleteSubject(subject);
    };
    card.element.querySelector(".card-body").appendChild(deleteButton);

    containerRow.appendChild(card.element);
  };
}
