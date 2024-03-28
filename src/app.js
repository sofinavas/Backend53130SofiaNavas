const express = require("express");
const app = express();
const PUERTO = 8080;
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const exphbs = require("express-handlebars");

const viewsRouter = require("./routes/views.router.js");

//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configuro Handlebars

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);

//Y nunca nos olvidemos del listen...

app.listen(PUERTO, () => {
  console.log(`Escuchando el puerto: ${PUERTO}`);
});
