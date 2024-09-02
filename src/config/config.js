import dotenv from "dotenv";

dotenv.config();

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
