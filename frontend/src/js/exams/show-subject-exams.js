import Card from "../components/card.js";
import Modal from "../components/modal.js";
import Exam from "../models/exam.js";
import { handleResponse, logError } from "../utils/errorHandling.js";

const ALERT_ID = "alert";

const renderExam = (exam) => {
  const modalEditExam = new Modal("modalEditExams");

  modalEditExam.onClick((id, values) => exam.editExam(id, values));
  const card = new Card(exam.id, exam.name, `show_exam.html?examId=${exam.id}`);

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.classList.add("btn", "btn-danger");
  deleteButton.onclick = () => {
    try {
      exam.deleteExam();
    } catch (error) {
      logError(error, ALERT_ID);
    }
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
      const examData = await handleResponse(response);
      modalEditExam.setValues(examData);
    } catch (error) {
      logError(error, ALERT_ID);
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
    const exams = await handleResponse(response);
    return exams;
  } catch (error) {
    logError(error, ALERT_ID);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const subjectId = urlParams.get("subjectId");
  const exams = await getExams(subjectId);
  exams.forEach((e) => {
    const exam = new Exam(e.id, e.name, e.subjectId);
    renderExam(exam);
  });
});
