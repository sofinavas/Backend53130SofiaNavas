export function authorize(roles) {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .send("Acceso denegado: No tienes los permisos necesarios.");
    }
    next();
  };
}
