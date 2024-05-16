const passport = require("passport");
const local = require("passport-local");
const GitHubStrategy = require("passport-github2");

const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");

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
          //Verifico si ya existe registro con ese mail:
          let usuario = await UserModel.findOne({ email });

          if (usuario) {
            return done(null, false);
          }

          //Si no existe, lo creo
          let newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          //Si todo resulta bien, puedo mandar done con el usuario generado

          let resultado = await UserModel.create(newUser);
          return done(null, resultado);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  //Estrategia para el login:
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          //verifico si existe
          let usuario = await UserModel.findOne({ email });
          if (!usuario) {
            console.log("Usuario inexistente");
            return done(null, false);
          }
          //si existe, verifico la contraseña
          if (!isValidPassword(password, usuario)) {
            return done(null, false);
          }
          //si todo anda bien, retorno el usuario
          return done(null, usuario);
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
  //Estrategia con Github:
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv23liGXYtmbZnDPzI32",
        clientSecret: "62b6f9fe667ae5476ec65a58d685ae3f4bfd910c",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        //Veo los datos del perfil
        console.log("Profile:", profile);
        try {
          let user = await UserModel.findOne({ email: profile._json.email });

          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: "",
              email: profile._json.email,
              password: "",
            };
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

module.exports = initializePassport;
