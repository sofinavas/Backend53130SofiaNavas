const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");

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
        expiresIn: "2h",
      });

      res.cookie("cookieToken", token, { maxAge: 3600000, httpOnly: true });
      res.redirect("/api/users/profile");
    } catch (error) {
      console.error("Error en register:", error);
      res.status(500).send("Error interno del servidor en el userManager");
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
        expiresIn: "2h",
      });

      res.cookie("cookieToken", token, { maxAge: 3600000, httpOnly: true });
      res.redirect("/api/users/profile");
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).send("Error interno del servidor en el userManager");
    }
  }
  async profile(req, res) {
    const userDto = new UserDto(
      req.user.first_name,
      req.user.last_name,
      req.user.role
    );
    const isAdmin = req.user.role === "admin";
    res.render("profile", { user: userDto, isAdmin });
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
    passport.authenticate("github", { failureRedirect: "/login" })(
      req,
      res,
      () => {
        req.session.user = req.user;
        req.session.login = true;
        res.redirect("/profile");
      }
    );
  }
}

module.exports = UserController;
