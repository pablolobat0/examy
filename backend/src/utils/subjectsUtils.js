import { SubjectNotFoundError } from "../utils/errorHandling.js";

export const getSubjectById = async (subjectModel, id) => {
  const subject = await subjectModel.findByPk(id);
  if (!subject) {
    throw new SubjectNotFoundError("La asignatura especificada no existe");
  }
  return subject;
};

export const getExamsWithSubjectId = async (examModel, subjectId) => {
  const exams = await examModel.findAll({
    where: {
      subjectId: subjectId,
    },
  });
  return exams;
};
