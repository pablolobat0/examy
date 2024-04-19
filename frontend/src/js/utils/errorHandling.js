const handleResponse = async (response) => {
  if (!response.ok) {
    return response.json().then((data) => {
      const errorMessage = data.error || "Failed to fetch data";
      throw new Error(errorMessage);
    });
  }
  const responseData = await response.json();
  return responseData;
};

const logError = (error) => {
  console.error("Error:", error.message);
  // Puedes agregar lógica adicional, como enviar errores al servidor de registro, etc.
};

export { handleResponse, logError };
