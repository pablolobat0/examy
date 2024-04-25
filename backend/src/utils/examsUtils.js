import fs from "fs";
import { ExamNotFoundError } from "./errorHandling.js";

export const getExamById = async (examModel, examId) => {
  const exam = await examModel.findByPk(examId);
  if (!exam) {
    throw new ExamNotFoundError("El examen especificado no existe");
  }
};

export const getExamsQuestionsIds = async (questionModel, exams) => {
  let questionsIds = [];
  for (const exam of exams) {
    questionsIds = questionsIds.concat(
      await questionModel.findAll({
        attributes: ["id"],
        where: {
          examId: exam.id,
        },
      }),
    );
  }

  return questionsIds;
};

export const processFile = (filePath) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      throw new Error("Error al leer el fichero");
    }

    let jsonData = JSON.parse(data);

    return jsonData;
  });
};
