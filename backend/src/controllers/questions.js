export class QuestionsController {
  constructor({ questionModel, answerModel }) {
    this.questionModel = questionModel;
    this.answerModel = answerModel;
  }

  getAllQuestions = async (req, res) => {
    try {
      const questions = await this.questionModel.findAll();
      res.status(200).json(questions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener las preguntas" });
    }
  };

  getQuestionAnswers = async (req, res) => {
    try {
      const questionId = parseInt(req.params.questionId);
      console.log(questionId);
      const question = await this.questionModel.findByPk(questionId);
      console.log(question);
      if (!question) {
        res
          .status(404)
          .json({ message: "No se ha encontrado la pregunta indicada" });
      }

      const answers = await this.answerModel.findAll({
        where: { questionId: questionId },
      });

      res.status(200).json(answers);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error al obtener las respuestas de la pregunta" });
    }
  };
}
