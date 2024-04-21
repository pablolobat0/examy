import Card from "../components/card.js";
import Modal from "../components/modal.js";
import Subject from "../models/subject.js";
import { handleResponse, logError } from "../utils/errorHandling.js";

const ALERT_ID = "alert";

const createSubject = async (s) => {
  const subject = new Subject(s.id, s.name);
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
    try {
      subject.deleteSubject();
    } catch (error) {
      logError(error, ALERT_ID);
    }
  };
  card.element.querySelector(".card").appendChild(deleteButton);

  const modalEditSubject = new Modal("modalEditSubject");

  modalEditSubject.onClick((id, values) => subject.editSubject(id, values));

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
      const subjectData = await handleResponse(response);
      modalEditSubject.setValues(subjectData);
    } catch (error) {
      logError(error, ALERT_ID);
    }
  };
  card.element.querySelector(".card").appendChild(editButton);

  containerRow.appendChild(card.element);
};

const getSubjects = async () => {
  try {
    const response = await fetch("http://localhost:8000/subjects", {
      method: "GET",
    });
    const subjects = await handleResponse(response);
    return subjects;
  } catch (error) {
    logError(error, ALERT_ID);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const subjects = await getSubjects();
  subjects.forEach((subject) => {
    createSubject(subject);
  });
});
