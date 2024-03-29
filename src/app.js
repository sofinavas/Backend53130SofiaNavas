const express = require("express");
const app = express();
const PUERTO = 8080;
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const viewsRouter = require("./routes/views.router.js");

//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Configuro Handlebars

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);

//Y nunca nos olvidemos del listen...

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando el puerto: ${PUERTO}`);
});

const io = socket(httpServer);

//Obtengo el array de productos:
const ProductManager = require("./controllers/product-manager.js");

//genero una instancia
const productManager = new ProductManager("./src/models/productos.json");

//genero la conexión:
io.on("connection", async (socket) => {
  console.log("Un cliente conectado");

  //Enviamos el array de productos al cliente:
  socket.emit("productos", await productManager.getProducts());

  //Recibo el evento "eliminarProducto" desde el cliente:
  socket.on("eliminarProducto", async (id) => {
    await productManager.deleteProduct(id);

    //Envio el array de productos actualizados:
    socket.emit("productos", await productManager.getProducts());
  });
  //Recibo el evento "agregarProducto" desde el cliente:
  socket.on("agregarProducto", async (producto) => {
    await productManager.addProduct(producto);
    socket.emit("productos", await productManager.getProducts());
  });
});
