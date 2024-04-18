const express = require("express");
const path = require("path");

const app = express();

// Sirve toda la carpeta del proyecto como archivos estáticos
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// Ruta para manejar solicitudes de archivos HTML específicos
app.get("/*.html", (req, res) => {
  const requestedFile = req.params[0] + ".html";
  res.sendFile(path.join(__dirname, "public", requestedFile));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});
