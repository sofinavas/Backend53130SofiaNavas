//Acá hago la conexión con MONGODB:

const mongoose = require("mongoose");
const configObject = require("./config/config.js");

mongoose
  .connect(configObject.mongoURL)
  .then(() => console.log("Conexion exitosa a MongoDB"))
  .catch((error) => console.log("Error en la conexion con MongoDB", error));
