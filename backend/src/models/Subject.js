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
  },
});

export default Subject;
