import { Router } from "express";
import { ExamsController } from "../controllers/exams.js";
import multer from "multer";
import path from "path";

export const createExamsRouter = ({
  examModel,
  subjectModel,
  questionModel,
  answerModel,
}) => {
  const examsRouter = Router();
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "/tmp");
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    },
  });

  const upload = multer({ storage: storage });

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
