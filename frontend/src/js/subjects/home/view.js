import Card from "../../components/card.js";
import Modal from "../../components/modal.js";

export default class View {
  constructor() {
    this.modalEditSubject = new Modal("modalEditSubject");

    this.modalEditSubject.onClick((id, values) => this.editSubject(id, values));
  }

  editSubject = async (id, name) => {
    const response = await fetch(`http://localhost:8000/subjects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    });
    if (!response.ok) {
      throw new Error("Failed to update ");
    }

    const card = document.getElementById(id);
    const cardTitle = card.querySelector(".card-title");
    cardTitle.innerHTML = name;
  };

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
    const card = new Card(
      subject.id,
      subject.name,
      `show_subject_exams.html?subjectId=${subject.id}`,
    );
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.onclick = () => {
      this.deleteSubject(subject);
    };
    card.element.querySelector(".card").appendChild(deleteButton);

    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.classList.add("btn", "btn-primary");
    editButton.onclick = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/subjects/${subject.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to get the subject");
        }
        const subjectData = await response.json();
        this.modalEditSubject.setValues(subjectData);
      } catch (error) {
        console.error(error);
      }
    };
    card.element.querySelector(".card").appendChild(editButton);

    containerRow.appendChild(card.element);
  };
}
