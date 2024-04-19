document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const examId = urlParams.get("examId");
  const container = document.querySelector(".row");

  const renderQuestion = async (question) => {
    const cardQuestion = document.createElement("div");
    cardQuestion.classList.add("card", "mb-3");
    cardQuestion.innerHTML = `
        <div class="card-body">
          <p class="card-text">${question.statement}</p>
          <div class="form-group">
          </div>
        </div>`;
    const response = await fetch(
      `http://localhost:8000/questions/${question.id}/answers`,
      { method: "GET" },
    );
    if (!response.ok) {
      throw new Error("Failed to get the answers");
    }
    const answers = await response.json();
    answers.forEach((answer) => {
      const answerInput = document.createElement("input");
      answerInput.classList.add("form-check-input");
      answerInput.type = "radio";
      answerInput.name = `question_${question.id}`;
      answerInput.value = answer.text;

      const answerLabel = document.createElement("label");
      answerLabel.classList.add("form-check-label");
      answerLabel.innerText = answer.text;

      const answerWrapper = document.createElement("div");
      answerWrapper.classList.add("form-check");
      answerWrapper.appendChild(answerInput);
      answerWrapper.appendChild(answerLabel);

      cardQuestion.querySelector(".form-group").appendChild(answerWrapper);
    });
    container.appendChild(cardQuestion);
  };

  const getQuestions = async (examId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/exams/${examId}/questions`,
        {
          method: "GET",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to get the questions");
      }
      const questions = await response.json();
      questions.forEach((question) => renderQuestion(question));
    } catch (error) {
      console.log(error);
    }
  };

  getQuestions(examId);
});
