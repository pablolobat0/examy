import { Router } from "express";
import { SubjectsController } from "../controllers/subjects.js";

export const createSubjectsRouter = ({ subjectModel, examModel }) => {
  const subjectsRouter = Router();

  const subjectsController = new SubjectsController({
    subjectModel: subjectModel,
    examModel: examModel,
  });

  subjectsRouter.post("/", subjectsController.create);
  subjectsRouter.get("/:subjectId/exams", subjectsController.getSubjectExams);
  subjectsRouter.get("/:id", subjectsController.getSubject);
  subjectsRouter.get("/", subjectsController.getAllSubjects);
  subjectsRouter.delete("/:id", subjectsController.deleteSubject);
  subjectsRouter.put("/:id", subjectsController.updateSubject);
  return subjectsRouter;
};
