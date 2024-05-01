import fs from "fs";
import path from "path";
import readline from "readline";
import { ExamNotFoundError, InvalidExamFormatError } from "./errorHandling.js";

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

const processJson = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);
    const questions = jsonData.questions.map((questionData) => {
      const answers = questionData.options.map((optionData) => ({
        text: optionData.text,
        correct: optionData.correct,
      }));
      return {
        statement: questionData.text,
        answers: answers,
      };
    });
    return questions;
  } catch (error) {
    throw new InvalidExamFormatError("Formato de examen inválido");
  }
};

const processTxt = async (filePath) => {
  try {
    const questions = [];
    let currentQuestion = { statement: "", answers: [] };

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (line.trim() === "") {
        // Si la línea está vacía, es el final de una pregunta, así que la añadimos al array
        questions.push({ ...currentQuestion });
        currentQuestion = { statement: "", answers: [] };
      } else if (line.endsWith(":")) {
        // Si la línea termina con ":", es el enunciado de una pregunta
        currentQuestion.statement += line.trim();
      } else if (line.endsWith("*")) {
        const questionAnswer = {
          text: line.trim().slice(0, -1),
          correct: true,
        };
        currentQuestion.answers.push(questionAnswer);
      } else {
        const questionAnswer = {
          text: line.trim(),
          correct: false,
        };
        currentQuestion.answers.push(questionAnswer);
      }
    }

    // Añadimos la última pregunta al array
    questions.push(currentQuestion);

    return questions;
  } catch (error) {
    throw new InvalidExamFormatError("Formato de examen inválido");
  }
};

export const processFile = async (filePath) => {
  const extension = path.extname(filePath);
  switch (extension) {
    case ".json":
      return await processJson(filePath);
    case ".txt":
      return await processTxt(filePath);
    default:
      throw new InvalidExamFormatError("Formato de examen inválido");
  }
};
