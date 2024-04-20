import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Subject = sequelize.define("subject", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [1, 50],
        msg: "El nombre de la asignatura debe tener entre 3 y 50 caracteres",
      },
      is: {
        args: /^[a-zA-Z0-9_-\s]+$/,
        msg: "El nombre de la asignatura solo puede contener letras, números, espacios, barras bajas y guiones",
      },
    },
  },
});

export default Subject;
