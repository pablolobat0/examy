import express from "express";
import cors from "cors";

import { createSubjectsRouter } from "./routes/subjects.js";
import { createExamsRouter } from "./routes/exams.js";

export const createApp = ({
  subjectModel,
  examModel,
  questionModel,
  answerModel,
}) => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.disable("x-powered-by");

  const PORT = process.env.PORT ?? 8000;

  app.use(
    "/subjects",
    createSubjectsRouter({ subjectModel: subjectModel, examModel: examModel }),
  );
  app.use(
    "/exams",
    createExamsRouter({
      examModel: examModel,
      subjectModel: subjectModel,
      questionModel: questionModel,
      answerModel: answerModel,
    }),
  );

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
};
