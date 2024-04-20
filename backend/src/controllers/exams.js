import fs from "fs";
import {
  ExamNotFoundError,
  InvalidExamFormatError,
  SubjectNotFoundError,
  handleDatabaseError,
} from "../utils/errorHandling.js";

export class ExamsController {
  constructor({ examModel, subjectModel, questionModel, answerModel }) {
    this.examModel = examModel;
    this.subjectModel = subjectModel;
    this.questionModel = questionModel;
    this.answerModel = answerModel;
  }

  create = async (req, res) => {
    try {
      const { name, subjectId } = req.body;
      const filePath = req.file.path;

      const subject = await this.subjectModel.findByPk(subjectId);
      if (!subject) {
        throw new SubjectNotFoundError("La asignatura especificada no existe.");
      }

      const newExam = await this.examModel.create({
        name: name,
        subjectId: subjectId,
      });

      await this.processFileData(filePath, newExam.id);

      res.status(201).json(newExam);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };

  processFileData = (filePath, examId) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          reject(new Error("Error al leer el fichero"));
          return;
        }

        let jsonData;
        try {
          jsonData = JSON.parse(data);
          jsonData.questions.forEach(async (questionData) => {
            const question = await this.questionModel.create({
              statement: questionData.text,
              examId: examId,
            });

            questionData.options.forEach(async (optionData) => {
              await this.answerModel.create({
                text: optionData.text,
                correct: optionData.correct,
                questionId: question.id,
              });
            });
          });
          resolve();
        } catch (error) {
          reject(new InvalidExamFormatError("Formato de examen inválido"));
        }
      });
    });
  };

  getExamsBySubjectId = async (req, res) => {
    try {
      const subjectId = parseInt(req.params.subjectId);

      const subject = await this.subjectModel.findByPk(subjectId);
      if (!subject) {
        throw new SubjectNotFoundError("La asignatura especificada no existe.");
      }
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

      const exam = await this.examModel.findByPk(examId);
      res.status(200).json(exam);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };

  deleteExam = async (req, res) => {
    try {
      const examId = parseInt(req.params.examId);

      const exam = await this.examModel.findByPk(examId);
      if (!exam) {
        throw new ExamNotFoundError("El examen especificado no existe");
      }
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
      const exam = await this.examModel.findByPk(examId);
      if (!exam) {
        throw new ExamNotFoundError("El examen especificado no existe");
      }
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
      const exam = await this.examModel.findByPk(examId);
      if (!exam) {
        throw new ExamNotFoundError("El examen especificado no existe");
      }
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
