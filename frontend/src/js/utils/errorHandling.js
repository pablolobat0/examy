import Alert from "../components/alert.js";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch the data");
  }
  const responseData = await response.json();
  return responseData;
};

const logError = (error, alertId) => {
  const alert = new Alert(alertId);
  alert.show(error.message);
};

export { handleResponse, logError };
