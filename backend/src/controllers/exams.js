import { handleDatabaseError } from "../utils/errorHandling.js";
import { getSubjectById } from "../utils/subjectsUtils.js";
import { getExamById, processFile } from "../utils/examsUtils.js";

export class ExamsController {
  constructor({ examModel, subjectModel, questionModel, answerModel }) {
    this.examModel = examModel;
    this.subjectModel = subjectModel;
    this.questionModel = questionModel;
    this.answerModel = answerModel;
  }

  create = async (req, res) => {
    const { name, subjectId } = req.body;
    const filePath = req.file.path;

    await getSubjectById(this.subjectModel, subjectId);

    const newExam = await this.examModel.create({
      name: name,
      subjectId: subjectId,
    });

    const questions = await processFile(filePath);

    for (const q of questions) {
      const question = await this.questionModel.create({
        statement: q.statement,
        examId: newExam.id,
      });
      for (const answer of q.answers) {
        await this.answerModel.create({
          text: answer.text,
          correct: answer.correct,
          questionId: question.id,
        });
      }
    }

    res.status(201).json(newExam);
  };

  getExamsBySubjectId = async (req, res) => {
    try {
      const subjectId = parseInt(req.params.subjectId);
      await getSubjectById(this.subjectModel, subjectId);

      const exams = await this.examModel.findAll({
        where: {
          subjectId: subjectId,
        },
      });
      res.status(200).json(exams);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };

  getExam = async (req, res) => {
    try {
      const examId = parseInt(req.params.examId);
      const exam = await getExamById(this.examModel, examId);
      res.status(200).json(exam);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };

  deleteExam = async (req, res) => {
    try {
      const examId = parseInt(req.params.examId);
      const exam = await getExamById(this.examModel, examId);
      await exam.destroy();
      res
        .status(200)
        .json({ message: "El examen ha sido eliminado con exito" });
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };

  updateExam = async (req, res) => {
    try {
      const examId = parseInt(req.params.examId);
      const { name } = req.body;
      const exam = await getExamById(this.examModel, examId);

      exam.name = name;
      await exam.save();
      res
        .status(200)
        .json({ message: "El examen ha sido actualizado con exito" });
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };

  getExamQuestions = async (req, res) => {
    try {
      const examId = parseInt(req.params.examId);
      await getExamById(this.examModel, examId);

      const questions = await this.questionModel.findAll({
        where: {
          examId: examId,
        },
      });
      res.status(200).json(questions);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };
}
