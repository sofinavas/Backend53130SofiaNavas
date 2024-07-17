const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const UserDTO = require("../dto/user.dto.js");
const { generarResetToken } = require("../utils/tokenreset.js");
const passport = require("passport");
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();

class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password, age } = req.body;
    try {
      const userExists = await UserModel.findOne({ email });
      if (userExists) {
        return res
          .status(400)
          .send("Ya existe un usuario registrado con ese email");
      }
      //Crear carrito
      const newCart = new CartModel();
      await newCart.save();

      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        cart: newCart._id,
        password: createHash(password),
        age,
      });

      await newUser.save();
      const token = jwt.sign({ user: newUser }, "my_secret_jwt", {
        expiresIn: "1h",
      });

      res.cookie("cookieToken", token, { maxAge: 3600000, httpOnly: true });
      res.redirect("/api/users/profile");
    } catch (error) {
      console.error("Error en register:", error);
      res.status(500).send("Error interno del servidor en el userController");
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const foundUser = await UserModel.findOne({ email });
      if (!foundUser) {
        return res
          .status(401)
          .send("No hay un usuario con ese email registrado");
      }

      const isValid = isValidPassword(password, foundUser);
      if (!isValid) {
        return res.status(401).send("Contraseña incorrecta");
      }

      const token = jwt.sign({ user: foundUser }, "my_secret_jwt", {
        expiresIn: "1h",
      });

      res.cookie("cookieToken", token, { maxAge: 3600000, httpOnly: true });
      res.redirect("/api/users/profile");
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).send("Error interno del servidor en el userController");
    }
  }
  async profile(req, res) {
    try {
      const isPremium = req.user.role === "premium";
      const userDto = new UserDTO(
        req.user.first_name,
        req.user.last_name,
        req.user.role
      );
      const isAdmin = req.user.role === "admin";

      res.render("profile", { user: userDto, isPremium, isAdmin });
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }

  async logout(req, res) {
    res.clearCookie("cookieToken");
    res.redirect("/login");
  }

  async admin(req, res) {
    if (req.user.user.role !== "admin") {
      return res.status(403).send("Denied access");
    }
    res.render("admin");
  }

  async githubAuth(req, res) {
    passport.authenticate("github", { scope: ["user:email"] })(req, res);
  }

  async githubCallBack(req, res) {
    passport.authenticate("github", (err, user, info) => {
      if (err) {
        return res.redirect("/login");
      }
      if (!user) {
        return res.redirect("/login");
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.redirect("/login");
        }
        return res.redirect("/profile");
      });
    })(req, res);
  }

  async requestPasswordReset(req, res) {
    const { email } = req.body;
    try {
      //Buscar usuario por email
      const user = await UserModel.findOne({ email });
      if (!user) {
        //si no existe un usuario con ese email
        return res
          .status(400)
          .send("No hay un usuario registrado con ese email");
      }
      //si hay usuario con ese email, generamos un token
      const token = generarResetToken();
      //guardamos el token en el usuario
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      //enviamos un email con el token
      await emailManager.enviarCorreoRestablecimiento(
        email,
        user.first_name,
        token
      );
      res
        .status(200)
        .send("Se envio un email con el token de restablecimiento");
      res.redirect("/confirmacion-envio");
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
  async resetPassword(req, res) {
    const { email, password, token } = req.body;
    try {
      //Busco el usuario por email
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .send("No hay un usuario registrado con ese email");
      }

      //si el token es válido
      const resetToken = user.resetToken;
      if (!resetToken || resetToken !== token) {
        return res.status(400).send("Token inválido");
      }
      //verifico si el token ha expirado
      const ahora = new Date();
      if (ahora > resetToken.expire) {
        return res.render("changepassword", {
          error: "El token ha expirado",
        });
      }
      //verifico que la nueva contraseña sea distinta a la anterior
      if (isValidPassword(password, user)) {
        return res.render("changepassword", {
          error: "La nueva contraseña es la misma que la anterior",
        });
      }
      //actualizo la contraseña
      user.password = createHash(password);

      //Marco el token como usado
      user.resetToken = undefined;
      await user.save();

      return res.redirect("/login");
    } catch (error) {
      res.status(500).render("passwordreset", {
        error: "Error interno del servidor",
      });
    }
  }
  //Cambiar el rol del usuario:
  async cambiarRolPremium(req, res) {
    const { uid } = req.params;
    try {
      //Busco el usuario:
      const user = await UserModel.findById(uid);

      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      //Si lo encuentro, le cambio el rol:

      const nuevoRol = user.role === "usuario" ? "premium" : "usuario";

      const actualizado = await UserModel.findByIdAndUpdate(uid, {
        role: nuevoRol,
      });
      res.json(actualizado);
    } catch (error) {
      res.status(500).send("Error en el servidor");
    }
  }
}

module.exports = UserController;
