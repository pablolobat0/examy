import { Router } from "express";
import { ExamsController } from "../controllers/exams.js";

export const examsRouter = Router();

examsRouter.post("/", ExamsController.create);
