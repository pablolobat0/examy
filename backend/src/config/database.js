import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const username = process.env.USERNAME;
const userPassword = process.env.USER_PASSWORD;
const dbName = process.env.DB_NAME;

// Configuración de la base de datos
const sequelize = new Sequelize({
  dialect: "postgres",
  host: "database",
  port: 5432,
  username: username,
  password: userPassword,
  database: dbName,
});

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
  process.exit(1);
}

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Todos los modelos se han sincronizado correctamente.");
  })
  .catch((error) => {
    console.error("Error al sincronizar los modelos:", error);
  });

export default sequelize;
