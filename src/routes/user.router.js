const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
// router.get(
//   "/profile",
//   passport.authenticate("jwt", { session: false }),
//   userController.profile
// );
router.post("/logout", userController.logout.bind(userController)); //.bind() se usa en este caso para asegurar que el método logout del userController mantenga el contexto correcto cuando es llamado como un manejador de ruta en Express.
router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  userController.admin
);

//Github
router.get("/github", userController.githubAuth.bind(userController));
router.get(
  "/githubcallback",
  userController.githubCallBack.bind(userController)
);

module.exports = router;
