import { handleResponse, logError } from "../utils/errorHandling.js";

export default class Exam {
  constructor(id, name, subjectId) {
    this.id = id;
    this.name = name;
    this.subjectId = subjectId;
  }

  deleteExam = async () => {
    const response = await fetch(`http://localhost:8000/exams/${this.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    await handleResponse(response);
    const buttonCard = document.getElementById(this.id);
    buttonCard.remove();
  };

  editExam = async (id, name) => {
    const response = await fetch(`http://localhost:8000/exams/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    });
    await handleResponse(response);

    this.name = name;
    const card = document.getElementById(id);
    const cardTitle = card.querySelector(".card-title");
    cardTitle.innerHTML = name;
  };
}
