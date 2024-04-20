import {
  QuestionNotFoundError,
  handleDatabaseError,
} from "../utils/errorHandling.js";

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
      handleDatabaseError(error, res);
    }
  };

  getQuestionAnswers = async (req, res) => {
    try {
      const questionId = parseInt(req.params.questionId);
      const question = await this.questionModel.findByPk(questionId);
      if (!question) {
        throw new QuestionNotFoundError("La pregunta especificada no existe");
      }

      const answers = await this.answerModel.findAll({
        where: { questionId: questionId },
      });

      res.status(200).json(answers);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };
}
