import passport from "passport";
import local from "passport-local";
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import GitHubStrategy from "passport-github2";
import configObject from "./config.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          let usuario = await UserModel.findOne({ email });

          if (usuario) {
            return done(null, false, { message: "Usuario ya registrado" });
          }

          const passwordHash = await bcrypt.hash(password, 10);

          const role =
            email === configObject.admin01 || email === configObject.admin02
              ? "admin"
              : "user";

          let nuevoUsuario = {
            first_name,
            last_name,
            email,
            age,
            password: passwordHash,
            role: role,
          };

          let resultado = await UserModel.create(nuevoUsuario);
          return done(null, resultado);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const userFound = await UserModel.findOne({ email });

          if (userFound) {
            const isMatch = await bcrypt.compare(password, userFound.password);

            if (isMatch) {
              return done(null, userFound);
            } else {
              return done(null, false);
            }
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
  });
};

passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: configObject.clientID,
      clientSecret: configObject.clientSecret,
      callbackURL: configObject.callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Profile:", profile);

      try {
        let usuario = await UserModel.findOne({
          email: profile._json.email,
        });

        if (!usuario) {
          const role =
            profile._json.email === configObject.admin01 ||
            profile._json.email === configObject.admin02
              ? "admin"
              : "user";

          let nuevoUsuario = {
            first_name: profile._json.name,
            last_name: "",
            age: 36,
            email: profile._json.email,
            password: "bolt", // Contraseña por defecto
            role: role,
          };

          let resultado = await UserModel.create(nuevoUsuario);
          done(null, resultado);
        } else {
          done(null, usuario);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default initializePassport;
