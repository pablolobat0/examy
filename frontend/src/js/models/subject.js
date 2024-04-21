import { handleResponse, logError } from "../utils/errorHandling.js";

export default class Subject {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  deleteSubject = async () => {
    const response = await fetch(`http://localhost:8000/subjects/${this.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    await handleResponse(response);
    const buttonCard = document.getElementById(this.id);
    buttonCard.remove();
  };

  editSubject = async (id, name) => {
    const response = await fetch(`http://localhost:8000/subjects/${id}`, {
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
