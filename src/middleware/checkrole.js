const jwt = require("jsonwebtoken");

const checkUserRole = (allowedRoles) => (req, res, next) => {
  const token = req.cookies.cookieToken;

  if (token) {
    jwt.verify(token, "my_secret_jwt", (err, decoded) => {
      if (err) {
        res.status(403).send("Acceso denegado. Invalid Token");
      } else {
        const userRole = decoded.user.role;
        if (allowedRoles.includes(userRole)) {
          next();
        } else {
          res
            .status(403)
            .send(
              "Acceso denegado. El usuario solicitado no tiene acceso a esta pagina"
            );
        }
      }
    });
  } else {
    res.status(403).send("Acceso denegado. Token no proporcionado");
  }
};
module.exports = checkUserRole;
