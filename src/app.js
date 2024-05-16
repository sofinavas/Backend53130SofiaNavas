const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
//me conecto
require("./database.js");

//Traigo las rutas de las vistas, productos y carritos
const viewsRouter = require("./routes/views.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const sessionRouter = require("./routes/session.router.js");
const userRouter = require("./routes/user.router.js");

//Passport:
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");

//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(
  session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://sofianavasd:sofianavasd@cluster0.zdkrisu.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0",
      ttl: 100,
    }),
  })
);
//Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Session
app.use(
  session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
  })
);

//Configuro Handlebars

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

//Y nunca nos olvidemos del listen...

app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto ${PUERTO}`);
});
