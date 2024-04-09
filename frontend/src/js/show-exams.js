import Card from "./components/card.js";

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const subjectId = urlParams.get("subjectId");
  console.log(subjectId);
  const renderExam = (exam) => {
    const card = new Card(exam.id, exam.name);

    const containerRow = document.querySelector(".row");
    containerRow.appendChild(card.element);
  };
  const getExams = async (subjectId) => {
    try {
      const response = await fetch(`http://localhost:8000/exams/${subjectId}`, {
        method: "GET",
      });
      const exams = await response.json();
      exams.forEach((exam) => renderExam(exam));
    } catch (error) {
      console.log(error);
    }
  };
  getExams(subjectId);
});
