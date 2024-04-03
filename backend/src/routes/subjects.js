import { Router } from "express";
import { SubjectsController } from "../controllers/subjects.js";

export const createSubjectsRouter = ({ subjectModel }) => {
  const subjectsRouter = Router();

  const subjectsController = new SubjectsController({
    subjectModel: subjectModel,
  });

  subjectsRouter.post("/", subjectsController.create);
  subjectsRouter.get("/", subjectsController.getAllSubjects);

  return subjectsRouter;
};
