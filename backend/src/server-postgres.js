import { createApp } from "./app.js";
import Subject from "./models/Subject.js";
import Exam from "./models/Exam.js";

createApp({ subjectModel: Subject, examModel: Exam });
