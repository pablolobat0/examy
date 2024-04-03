import Subject from "../models/Subject.js";

export class SubjectsController {
  static async create(req, res) {
    try {
      const { name } = req.body;

      const newSubject = await Subject.create({ name });
      res.status(201).json(newSubject);
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  }

  static async getAllSubjects(req, res) {
    try {
      const subjects = await Subject.findAll();
      res.status(200).json(subjects);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Ocurrió un error al obtener las asignaturas" });
    }
  }
}
