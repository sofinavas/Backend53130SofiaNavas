const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
//const session = require("express-session");
//const MongoStore = require("connect-mongo");

//me conecto
require("./database.js");

//Traigo las rutas de las vistas, productos y carritos
const viewsRouter = require("./routes/views.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");

const userRouter = require("./routes/user.router.js");

//Passport:
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");

//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Passport
initializePassport();
app.use(passport.initialize());
app.use(cookieParser());
//AuthMiddleware
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);

//Configuro Handlebars

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("api/users", userRouter);
app.use("/", viewsRouter);

//Y nunca nos olvidemos del listen...

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto ${PUERTO}`);
});

//Websockets:
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);
