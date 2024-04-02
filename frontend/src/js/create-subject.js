document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createSubject");
  const uriBackend = "http://localhost:8000/subjects";

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    const formData = new FormData(form); // Crear objeto FormData con los datos del formulario

    // Convertir FormData a un objeto JSON
    const name = formData.get("subjectName");
    // Enviar los datos al backend
    fetch(uriBackend, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Datos enviados correctamente al backend");
          // Redirigir a la página de inicio
          window.location.href = "../../../public/index.html";
        } else {
          console.error("Error al enviar datos al backend");
        }
      })
      .catch((error) => {
        console.error("Error de red:", error);
      });
  });
});
