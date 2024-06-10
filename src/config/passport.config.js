const passport = require("passport");
const jwt = require("passport-jwt");
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const UserModel = require("../models/user.model.js");

const GitHubStrategy = require("passport-github2");
const configObject = require("./config.js");

// Crea el extractor de cookies:
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["cookieToken"];
  }
  return token;
};

// Inicializa las estrategias de Passport
const initializePassport = () => {
  // Estrategia con JWT:
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: configObject.secret,
      },
      async (jwt_payload, done) => {
        try {
          const user = await UserModel.findById(jwt_payload.user._id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia con GitHub:
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
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serializa el usuario en la sesión
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserializa el usuario desde la sesión
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

module.exports = initializePassport;
