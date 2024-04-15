import { Router } from "express";
import { ExamsController } from "../controllers/exams.js";

export const createExamsRouter = ({ examModel, subjectModel }) => {
  const examsRouter = Router();

  const examsController = new ExamsController({
    examModel: examModel,
    subjectModel: subjectModel,
  });

  examsRouter.post("/", examsController.create);
  examsRouter.get("/:examId", examsController.getExam);
  examsRouter.delete("/:examId", examsController.deleteExam);
  examsRouter.put("/:examId", examsController.updateExam);

  return examsRouter;
};
