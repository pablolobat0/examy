import { Router } from "express";
import { QuestionsController } from "../controllers/questions.js";

export const createQuestionsRouter = ({ questionModel, answerModel }) => {
  const questionsRouter = Router();

  const questionsController = new QuestionsController({
    questionModel: questionModel,
    answerModel: answerModel,
  });
  questionsRouter.get("/", questionsController.getAllQuestions);
  questionsRouter.get(
    "/:questionId/answers",
    questionsController.getQuestionAnswers,
  );

  return questionsRouter;
};
