import { createApp } from "./app.js";
import Subject from "./models/Subject.js";
import Exam from "./models/Exam.js";
import Question from "./models/Question.js";
import Answer from "./models/Answer.js";

createApp({
  subjectModel: Subject,
  examModel: Exam,
  questionModel: Question,
  answerModel: Answer,
});
