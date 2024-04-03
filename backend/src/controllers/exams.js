import Exam from "../models/Exam.js";
import Subject from "../models/Subject.js";

export class ExamsController {
  static async create(req, res) {
    try {
      const { name, subjectId } = req.body;
      const subject = Subject.findByPk(subjectId);
      if (!subject) {
        return res
          .status(404)
          .json({ error: "La asignatura especificada no existe." });
      }

      const newExam = await Exam.create({ name, subjectId: subjectId });
      res.status(201).json(newExam);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Ha sucedido un error al crear el examen." });
    }
  }
}
