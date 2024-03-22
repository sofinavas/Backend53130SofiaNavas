const express = require("express");
const app = express();
const PUERTO = 8080;
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");

//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("¿Esta sería la Pastelería?");
});

//Rutas
app.use("/api", productsRouter);
app.use("/api", cartsRouter);

//Y nunca nos olvidemos del listen...

app.listen(PUERTO, () => {
  console.log(`Escuchando el puerto: ${PUERTO}`);
});
