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
