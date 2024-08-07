import winston from "winston";
import configObject from "../config/config.js";

const levels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

const level = () => {
  return configObject.estado === "produccion" ? "info" : "debug";
};

const colors = {
  debug: "blue",
  http: "magenta",
  info: "green",
  warning: "yellow",
  error: "red",
  fatal: "bold red",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [new winston.transports.Console()];

if (configObject.estado === "produccion") {
  transports.push(
    new winston.transports.File({
      filename: "errors.log",
      level: "fatal",
    })
  );
} else {
  transports.push(
    new winston.transports.File({
      filename: "errorsDesarrollo.log",
      level: "fatal",
    })
  );
}

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;
