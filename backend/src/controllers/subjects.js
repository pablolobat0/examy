export class SubjectsController {
  constructor({ subjectModel, examModel }) {
    this.subjectModel = subjectModel;
    this.examModel = examModel;
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

  getSubject = async (req, res) => {
    try {
      const subjectId = parseInt(req.params.id);
      const subject = await this.subjectModel.findByPk(subjectId);
      if (subject) {
        res.status(200).json(subject);
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

  getSubjectExams = async (req, res) => {
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

  updateSubject = async (req, res) => {
    try {
      const subjectId = parseInt(req.params.id);
      const { name } = req.body;

      const subject = await this.subjectModel.findByPk(subjectId);
      if (!subject) {
        return res.status(404).json({ error: "Subject not found" });
      }

      subject.name = name;
      await subject.save();

      res.status(200).json(subject);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Ocurrió un error al actualizar la asignatura" });
    }
  };
}
