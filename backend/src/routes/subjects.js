import { Router } from "express";
import { SubjectsController } from "../controllers/subjects.js";

export const createSubjectsRouter = ({
  subjectModel,
  examModel,
  questionModel,
}) => {
  const subjectsRouter = Router();

  const subjectsController = new SubjectsController({
    subjectModel: subjectModel,
    examModel: examModel,
    questionModel: questionModel,
  });

  subjectsRouter.post("/", subjectsController.create);
  subjectsRouter.get("/:subjectId/exams", subjectsController.getSubjectExams);
  subjectsRouter.get("/:id", subjectsController.getSubject);
  subjectsRouter.get("/", subjectsController.getAllSubjects);
  subjectsRouter.get(
    "/:subjectId/exams/questions/count",
    subjectsController.getNumberOfQuestions,
  );
  subjectsRouter.delete("/:id", subjectsController.deleteSubject);
  subjectsRouter.put("/:id", subjectsController.updateSubject);
  return subjectsRouter;
};
