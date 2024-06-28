const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();

// Ruta para registrar usuarios
router.post("/register", userController.register.bind(userController));

// Ruta para loguear usuarios
router.post("/login", userController.login.bind(userController));

// Ruta para cerrar sesión
router.post("/logout", userController.logout.bind(userController));

// Ruta para el perfil del usuario (debe estar autenticado)
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.profile.bind(userController)
);

// Ruta para acceso de administrador (debe estar autenticado)
router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  userController.admin.bind(userController)
);

// Rutas para autenticación con Github
router.get("/github", userController.githubAuth.bind(userController));
router.get(
  "/githubcallback",
  userController.githubCallBack.bind(userController)
);

module.exports = router;
