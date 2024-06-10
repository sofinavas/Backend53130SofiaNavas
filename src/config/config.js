const dotenv = require("dotenv");
const program = require("../utils/utils.js");
const { mode } = require("../utils/utils.js");

dotenv.config({
  path: mode === "produccion" ? "./.env.production" : "./.env.development",
});

const configObject = {
  PORT: process.env.PORT,
  mongoURL: process.env.MONGO_URL,
  clientID: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  callbackURL: process.env.CALLBACKURL,
  secret: process.env.SECRETMONGO,
  estado: process.env.ESTADO,
};

module.exports = configObject;
