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
    validate: {
      len: {
        args: [1, 50],
        msg: "El nombre del examen debe tener entre 3 y 50 caracteres",
      },
      is: {
        args: /^[a-zA-Z0-9_-\s]+$/,
        msg: "El nombre del examen solo puede contener letras, números, espacios, barras bajas y guiones",
      },
    },
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
