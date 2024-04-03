import { Router } from "express";
import { SubjectsController } from "../controllers/subjects.js";

export const subjectsRouter = Router();

subjectsRouter.post("/", SubjectsController.create);
subjectsRouter.get("/", SubjectsController.getAllSubjects);
