import errorDictionary from "../errors/enum.js";

function errorHandler(err, req, res, next) {
  console.log("errorHandler", err);
  const error = errorDictionary[err.code];
  if (error) {
    res.status(error.code).send(error.message);
  } else {
    res.status(500).send("Internal Server Error");
  }
}

export default errorHandler;
