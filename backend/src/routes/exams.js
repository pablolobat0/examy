import { Router } from "express";
import { ExamsController } from "../controllers/exams.js";
import multer from "multer";

export const createExamsRouter = ({
  examModel,
  subjectModel,
  questionModel,
  answerModel,
}) => {
  const examsRouter = Router();

  const upload = multer({ dest: "uploads/" });

  const examsController = new ExamsController({
    examModel: examModel,
    subjectModel: subjectModel,
    questionModel: questionModel,
    answerModel: answerModel,
  });

  examsRouter.post("/", upload.single("file"), examsController.create);
  examsRouter.get("/:examId", examsController.getExam);
  examsRouter.delete("/:examId", examsController.deleteExam);
  examsRouter.put("/:examId", examsController.updateExam);
  examsRouter.get("/:examId/questions", examsController.getExamQuestions);

  return examsRouter;
};
