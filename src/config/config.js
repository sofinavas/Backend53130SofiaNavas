const dotenv = require("dotenv");
const program = require("../utils/utils.js");
const { mode } = require("../utils/utils.js");

dotenv.config({
  path: mode === "produccion" ? "./.env.production" : "./.env.development",
});

const configObject = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  CLIENTID: process.env.CLIENTID,
  CLIENTSECRET: process.env.CLIENTSECRET,
  CALLBACKURL: process.env.CALLBACKURL,
  SECRETMONGO: process.env.SECRETMONGO,
  ESTADO: process.env.ESTADO,
};

module.exports = configObject;
