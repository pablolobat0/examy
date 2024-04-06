export class SubjectsController {
  constructor({ subjectModel }) {
    this.subjectModel = subjectModel;
  }
  create = async (req, res) => {
    try {
      const { name } = req.body;

      const newSubject = await this.subjectModel.create({ name });
      res.status(201).json(newSubject);
    } catch (error) {
      console.error(error);
      res.status(500);
    }
  };

  getAllSubjects = async (req, res) => {
    try {
      const subjects = await this.subjectModel.findAll();
      res.status(200).json(subjects);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Ocurrió un error al obtener las asignaturas" });
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
        res.status(404).json({ error: "La asignatura no existe" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Ocurrió un error al obtener las asignaturas" });
    }
  };
}
