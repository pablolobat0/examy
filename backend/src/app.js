import express from "express";
import cors from "cors";

import { subjectsRouter } from "./routes/subjects.js";
import { examsRouter } from "./routes/exams.js";

const app = express();
app.use(cors());

app.use(express.json());

app.disable("x-powered-by");

const PORT = process.env.PORT ?? 8000;

app.use("/subjects", subjectsRouter);
app.use("/exams", examsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
