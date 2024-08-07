// user.router.js
import express from "express";
import passport from "passport";
import UserController from "../controllers/user.controller.js";
import { authorize } from "../middleware/authmiddleware.js";

const router = express.Router();
const userController = new UserController();

router.post(
  "/",
  passport.authenticate("register", { failureRedirect: "/failedRegister" }),
  userController.register
);
router.get("/current", userController.getCurrentUser);
router.get("/failedRegister", userController.failedRegister);
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  userController.login
);
router.get("/faillogin", userController.failLogin);
router.get("/logout", userController.logout);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  userController.githubCallback
);
router.get(
  "/premium/:uid",
  authorize("admin"),
  userController.changeUserRoleGet
);
router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);

export default router;
