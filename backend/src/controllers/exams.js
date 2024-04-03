export class ExamsController {
  constructor({ examModel, subjectModel }) {
    this.examModel = examModel;
    this.subjectModel = subjectModel;
  }
  create = async (req, res) => {
    try {
      const { name, subjectId } = req.body;
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
      res.status(201).json(newExam);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Ha sucedido un error al crear el examen." });
    }
  };
}
