import { Sequelize } from "sequelize";

const username = process.env.USERNAME;
const userPassword = process.env.USER_PASSWORD;

// Configuración de la base de datos
const sequelize = new Sequelize({
  dialect: "postgres",
  host: "127.0.0.1",
  port: 5432,
  username: username,
  password: userPassword,
  database: "test_app",
});

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Todos los modelos se han sincronizado correctamente.");
  })
  .catch((error) => {
    console.error("Error al sincronizar los modelos:", error);
  });

export default sequelize;
