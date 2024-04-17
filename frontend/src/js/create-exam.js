document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8000/subjects", { method: "GET" })
    .then((response) => response.json())
    .then((subjects) => {
      const select = document.getElementById("selectSubject");
      subjects.forEach((subject) => {
        const optionElement = document.createElement("option");
        optionElement.value = subject.id;
        optionElement.textContent = subject.name;
        select.appendChild(optionElement);
      });
    });

  const form = document.getElementById("createExam");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    const select = document.getElementById("selectSubject");
    const formData = new FormData(form); // Crear objeto FormData con los datos del formulario
    // Convertir FormData a un objeto JSON
    formData.append("name", form.elements.examName.value);
    formData.append("subjectId", select.value);
    formData.append("file", form.elements.fileInput.files[0]);
    fetch("http://localhost:8000/exams", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("Datos enviados correctamente al backend");
          // Redirigir a la página de inicio
          window.location.href = "../../../public/index.html";
        } else {
          console.error("Error al crear el examen");
        }
      })
      .catch((error) => {
        console.error("Error de red:", error);
      });
  });
});
