import Card from "./components/card.js";
import Modal from "./components/modal.js";

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const subjectId = urlParams.get("subjectId");

  const deleteExam = async (exam) => {
    try {
      const response = await fetch(`http://localhost:8000/exams/${exam.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete the exam");
      }
      const buttonCard = document.getElementById(exam.id);
      buttonCard.remove();
    } catch (error) {
      console.error(error);
    }
  };

  const renderExam = (exam) => {
    const editExam = async (id, name) => {
      const response = await fetch(`http://localhost:8000/exams/${id}`, {
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

    const modalEditExam = new Modal("modalEditExams");

    modalEditExam.onClick((id, values) => editExam(id, values));
    const card = new Card(exam.id, exam.name);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.onclick = () => {
      deleteExam(exam);
    };
    card.element.querySelector(".card").appendChild(deleteButton);

    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.classList.add("btn", "btn-primary");
    editButton.onclick = async () => {
      try {
        const response = await fetch(`http://localhost:8000/exams/${exam.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to get the exam");
        }
        const examData = await response.json();
        modalEditExam.setValues(examData);
      } catch (error) {
        console.error(error);
      }
    };

    card.element.querySelector(".card").appendChild(editButton);

    const containerRow = document.querySelector(".row");
    containerRow.appendChild(card.element);
  };

  const getExams = async (subjectId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/subjects/${subjectId}/exams`,
        {
          method: "GET",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to get the exams");
      }
      const exams = await response.json();
      exams.forEach((exam) => renderExam(exam));
    } catch (error) {
      console.log(error);
    }
  };

  getExams(subjectId);
});
