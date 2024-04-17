import fs from "fs";

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

      const subject = this.subjectModel.findByPk(subjectId);
      if (!subject) {
        return res
          .status(404)
          .json({ error: "La asignatura especificada no existe." });
      }

      const newExam = await this.examModel.create({
        name,
        subjectId: subjectId,
      });

      this.processFileData(filePath, newExam.id);

      res.status(201).json(newExam);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Ha sucedido un error al crear el examen." });
    }
  };

  processFileData = async (filePath, examId) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer el archivo:", err);
        return res.status(500).json({ error: "Error al leer el archivo" });
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
      } catch (error) {
        console.error("Error al parsear el archivo JSON:", error);
        return res.status(400).json({ error: "Archivo JSON inválido" });
      }
    });
  };

  getExamsBySubjectId = async (req, res) => {
    try {
      const subjectId = parseInt(req.params.subjectId);

      const subject = await this.subjectModel.findByPk(subjectId);
      if (!subject) {
        return res
          .status(404)
          .json({ error: "La asignatura especificada no existe." });
      }
      const exams = await this.examModel.findAll({
        where: {
          subjectId: subjectId,
        },
      });
      res.status(200).json(exams);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Ha sucedido un error al buscar los examenes." });
    }
  };

  getExam = async (req, res) => {
    try {
      const examId = parseInt(req.params.examId);

      const exam = await this.examModel.findByPk(examId);
      res.status(200).json(exam);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Ha sucedido un error al buscar el examen." });
    }
  };

  deleteExam = async (req, res) => {
    try {
      const examId = parseInt(req.params.examId);

      const exam = await this.examModel.findByPk(examId);
      if (!exam) {
        return res
          .status(404)
          .json({ error: "El examen especificado no existe." });
      }
      await exam.destroy();
      res
        .status(200)
        .json({ message: "El examen ha sido eliminado con exito" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Ha sucedido un error al eliminar el examen." });
    }
  };

  updateExam = async (req, res) => {
    try {
      const examId = parseInt(req.params.examId);
      const { name } = req.body;
      const exam = await this.examModel.findByPk(examId);
      if (!exam) {
        return res
          .status(404)
          .json({ error: "El examen especificado no existe." });
      }
      exam.name = name;
      await exam.save();
      res
        .status(200)
        .json({ message: "El examen ha sido actualizado con exito" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Ha sucedido un error al actualizar el examen." });
    }
  };
}
