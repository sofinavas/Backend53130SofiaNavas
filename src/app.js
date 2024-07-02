const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cors = require("cors");
const path = require("path");
const authMiddleware = require("./middleware/authmiddleware.js");
const mongoose = require("mongoose");
const config = require("./config/config");

const app = express();

// Conectando a MongoDB
mongoose
  .connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conexión exitosa a MongoDB"))
  .catch((error) => console.error("Error en la conexión a MongoDB", error));

// Configurando Handlebars
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());
app.use(authMiddleware);

// Rutas
const viewsRouter = require("./routes/views.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const userRouter = require("./routes/user.router.js");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);

// Manejo de errores
app.use(require("./services/errors/info.js"));

// Escuchando en el puerto configurado
const PORT = config.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Websockets
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(server);

module.exports = app;

//Contraseña para aplicaciones: tpmg gqja agpk deqt
