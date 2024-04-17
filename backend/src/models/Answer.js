import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Question from "./Question.js";

const Answer = sequelize.define("answer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correct: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Question,
      key: "id",
    },
  },
});

// Establece la relación entre Question y Subject
Answer.belongsTo(Question, { foreignKey: "questionId" });

export default Answer;
