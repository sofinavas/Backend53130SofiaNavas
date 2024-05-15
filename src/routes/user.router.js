const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { createHash } = require("../utils/hashbcryp.js");

//Post para generar un usuario y almacenarlo en Mongo DB:

router.post("/", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;

  try {
    //Verifico si el email ya está registrado:
    const existsUser = await UserModel.findOne({ email: email });
    if (existsUser) {
      return res
        .status(400)
        .send({ error: "El correo electrónico ya se encuentra registrado" });
    }
    //Defino el rol del usuario:
    const role = email === "admincoder@coder.com" ? "admin" : "usuario";

    //Creo un nuevo usuario
    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password: createHash(password),
      age,
      role,
    });

    //Almaceno info del user en la sesión:
    req.session.login = true;
    req.session.user = { ...newUser._doc };

    res.redirect("/products");
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

module.exports = router;
