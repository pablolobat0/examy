import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Subject from "./Subject.js";

const Exam = sequelize.define("exam", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Subject,
      key: "id",
    },
  },
});

// Establece la relación entre Exam y Subject
Exam.belongsTo(Subject, { foreignKey: "subjectId" });

export default Exam;
