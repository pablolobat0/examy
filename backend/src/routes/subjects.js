import { Router } from "express";
import { SubjectsController } from "../controllers/subjects.js";

export const createSubjectsRouter = ({ subjectModel }) => {
  const subjectsRouter = Router();

  const subjectsController = new SubjectsController({
    subjectModel: subjectModel,
  });

  subjectsRouter.post("/", subjectsController.create);
  subjectsRouter.get("/:id", subjectsController.getSubject);
  subjectsRouter.get("/", subjectsController.getAllSubjects);
  subjectsRouter.delete("/:id", subjectsController.deleteSubject);
  subjectsRouter.put("/:id", subjectsController.updateSubject);
  return subjectsRouter;
};
