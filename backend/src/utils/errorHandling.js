const createErrorFactory = function (name) {
  return class BusinessError extends Error {
    constructor(message) {
      super(message);
      this.name = name;
    }
  };
};
export const SubjectNotFoundError = createErrorFactory("SubjectNotFoundError");
export const ExamNotFoundError = createErrorFactory("ExamNotFoundError");
export const QuestionNotFoundError = createErrorFactory(
  "QuestionNotFoundError",
);
export const InvalidExamFormatError = createErrorFactory(
  "InvalidExamFormatError",
);
export const InvalidNumberOfQuestionsError = createErrorFactory(
  "InvalidNumberOfQuestionsError",
);

export const handleDatabaseError = (error, res) => {
  switch (error.name) {
    case "SequelizeValidationError":
      const validationErrors = error.errors.map((error) => error.message);
      res.status(400).json({ message: validationErrors });
      break;

    case "SequelizeUniqueConstraintError":
    case "SubjectNotFoundError":
    case "ExamNotFoundError":
    case "QuestionNotFoundError":
    case "InvalidExamFormatError":
    case "InvalidNumberOfQuestionsError":
      res.status(404).json({ message: error.message });
      break;

    default:
      res.status(500).json({
        message:
          "Lo sentimos, se ha producido un error. Por favor, revisa tu conexión a internet e inténtalo de nuevo más tarde.",
      });
  }
};
