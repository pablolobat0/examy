import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Exam from "./Exam.js";

const Question = sequelize.define("question", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  statement: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  examId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Exam,
      key: "id",
    },
  },
});

Question.belongsTo(Exam, { foreignKey: "examId" });

export default Question;
