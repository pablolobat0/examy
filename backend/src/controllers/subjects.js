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
}
