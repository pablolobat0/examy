import { Op } from "sequelize";
import {
  InvalidNumberOfQuestionsError,
  SubjectNotFoundError,
  handleDatabaseError,
} from "../utils/errorHandling.js";

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
      const subject = await this.subjectModel.findByPk(subjectId);
      if (subject) {
        res.status(200).json(subject);
      } else {
        throw new SubjectNotFoundError("La asignatura especificada no existe");
      }
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };

  getSubjectExams = async (req, res) => {
    try {
      const subjectId = parseInt(req.params.subjectId);

      const subject = await this.subjectModel.findByPk(subjectId);
      if (!subject) {
        throw new SubjectNotFoundError("La asignatura especificada no existe");
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

  getNumberOfQuestions = async (req, res) => {
    try {
      const subjectId = parseInt(req.params.subjectId);

      const subject = await this.subjectModel.findByPk(subjectId);
      if (!subject) {
        throw new SubjectNotFoundError("La asignatura especificada no existe");
      }
      const exams = await this.examModel.findAll({
        where: {
          subjectId: subjectId,
        },
      });
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

      const subject = await this.subjectModel.findByPk(subjectId);
      if (!subject) {
        throw new SubjectNotFoundError("La asignatura especificada no existe");
      }

      const numberOfQuestions = req.query.numberOfQuestions;

      const exams = await this.examModel.findAll({
        where: {
          subjectId: subjectId,
        },
      });

      let questionsIds = [];

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
      const questionIdsArray = questionsIds.map((question) => question.id);

      const randomQuestionsIds = [];

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
      const subject = await this.subjectModel.findByPk(subjectId);
      if (subject) {
        await subject.destroy();
        res.status(200).json({ message: "Asignatura borrada con éxito" });
      } else {
        throw new SubjectNotFoundError("La asignatura especificada no existe");
      }
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };

  updateSubject = async (req, res) => {
    try {
      const subjectId = parseInt(req.params.id);
      const { name } = req.body;

      const subject = await this.subjectModel.findByPk(subjectId);
      if (!subject) {
        throw new SubjectNotFoundError("La asignatura especificada no existe");
      }

      subject.name = name;
      await subject.save();

      res.status(200).json(subject);
    } catch (error) {
      handleDatabaseError(error, res);
    }
  };
}
