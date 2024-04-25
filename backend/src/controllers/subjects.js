import { Op } from "sequelize";
import {
  InvalidNumberOfQuestionsError,
  handleDatabaseError,
} from "../utils/errorHandling.js";
import {
  getSubjectById,
  getExamsWithSubjectId,
} from "../utils/subjectsUtils.js";

import { getExamsQuestionsIds } from "../utils/examsUtils.js";

export class SubjectsController {
  constructor({ subjectModel, examModel, questionModel }) {
    this.subjectModel = subjectModel;
    this.examModel = examModel;
    this.questionModel = questionModel;
  }

  create = async (req, res) => {
    try {
      const { name } = req.body;

      const newSubject = await this.subjectModel.create({ name });
      res.status(201).json(newSubject);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };

  getAllSubjects = async (req, res) => {
    try {
      const subjects = await this.subjectModel.findAll();
      res.status(200).json(subjects);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };

  getSubject = async (req, res) => {
    try {
      const subjectId = parseInt(req.params.id);
      const subject = await getSubjectById(this.subjectModel, subjectId);

      res.status(200).json(subject);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };

  getSubjectExams = async (req, res) => {
    try {
      const subjectId = parseInt(req.params.subjectId);
      await getSubjectById(this.subjectModel, subjectId);

      const exams = await getExamsWithSubjectId(this.examModel, subjectId);
      res.status(200).json(exams);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };

  getNumberOfQuestions = async (req, res) => {
    try {
      const subjectId = parseInt(req.params.subjectId);
      await getSubjectById(this.subjectModel, subjectId);

      const exams = await getExamsWithSubjectId(this.examModel, subjectId);

      let questionsNumber = 0;

      for (const exam of exams) {
        questionsNumber += await this.questionModel.count({
          where: {
            examId: exam.id,
          },
        });
      }

      res.status(200).json(questionsNumber);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };

  getRandomQuestions = async (req, res) => {
    try {
      const subjectId = parseInt(req.params.subjectId);
      await getSubjectById(this.subjectModel, subjectId);

      const numberOfQuestions = req.query.numberOfQuestions;

      const exams = await getExamsWithSubjectId(this.examModel, subjectId);

      // Obtenemos un array de con todos los IDs de las preguntas
      let questionsIds = getExamsQuestionsIds(this.questionModel, exams);
      for (const exam of exams) {
        questionsIds = questionsIds.concat(
          await this.questionModel.findAll({
            attributes: ["id"],
            where: {
              examId: exam.id,
            },
          }),
        );
      }

      if (questionsIds.length < numberOfQuestions) {
        throw new InvalidNumberOfQuestionsError(
          "El número de preguntas indicado es inválido",
        );
      }

      // Extraemos el id de la pregunta
      const questionIdsArray = questionsIds.map((question) => question.id);
      const randomQuestionsIds = [];
      // Cada vez que se obtiene un id aleatorio se quita del array
      while (randomQuestionsIds.length != numberOfQuestions) {
        const index = Math.floor(Math.random() * questionIdsArray.length);
        randomQuestionsIds.push(questionIdsArray.splice(index, 1)[0]);
      }

      const questions = await this.questionModel.findAll({
        where: { id: { [Op.or]: randomQuestionsIds } },
      });

      res.status(200).json(questions);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };

  deleteSubject = async (req, res) => {
    try {
      const subjectId = parseInt(req.params.id);
      const subject = await getSubjectById(this.subjectModel, subjectId);

      await subject.destroy();
      res.status(200).json({ message: "Asignatura borrada con éxito" });
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };

  updateSubject = async (req, res) => {
    try {
      const subjectId = parseInt(req.params.id);
      const { name } = req.body;

      const subject = await getSubjectById(this.subjectModel, subjectId);

      subject.name = name;
      await subject.save();

      res.status(200).json(subject);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };
}
