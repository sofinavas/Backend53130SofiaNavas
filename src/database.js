//Acá hago la conexión con MONGODB:
//Traigo mongoose y utilizo el método connect
const mongoose = require("mongoose");

//Creo la conexión a la BD

mongoose
  .connect(
    "mongodb+srv://sofianavasd:sofianavasd@cluster0.zdkrisu.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Conexion exitosa"))
  .catch((error) => console.log("Error en la conexion", error));
