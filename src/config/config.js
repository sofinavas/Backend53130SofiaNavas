import dotenv from "dotenv";

import program from "../utils.js";

const { mode } = program.opts();

dotenv.config({
  path: mode === "produccion" ? "./.env.produccion" : "./.env.desarrollo",
});

const configObject = {
  PORT: process.env.PORT,
  mongoURL: process.env.MONGOURL,
  clientID: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  callbackURL: process.env.CALLBACKURL,
  secret: process.env.SECRETMONGO,
  admin01: process.env.ADMIN01,
  admin02: process.env.ADMIN02,
  estado: process.env.estado,
  mailerUser: process.env.MAILERUSER,
  mailerPassword: process.env.MAILERPASSWORD,
};

export default configObject;
