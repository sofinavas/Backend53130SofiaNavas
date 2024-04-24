const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const socket = require("socket.io");
//me conecto
require("./database.js");
//Traigo las rutas de las vistas, productos y carritos
const viewsRouter = require("./routes/views.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");

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

//Por ahora guardaremos este chat en la memoria volatil del servidor en un pequeño array (más adelante lo haremos en una base de datos)
let messages = [];

//Establecemos la conection con nuestro cliente
io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("message", (data) => {
    messages.push(data);
    //Emitimos mensaje para el cliente con todo el array de datos:
    io.emit("messagesLogs", messages);
  });
});
const MessageModel = require("./models/message.model.js");
io.on("connection", (socket) => {
  console.log("un chateador conectado");
  socket.on("message", async (data) => {
    //Guardo el mensaje en mongoDB:
    await MessageModel.create(data);

    //obtengo mensajes de mongo DB y se los paso al cliente:
    const messages = await MessageModel.find();
    console.log(messages);
    io.sockets.emit("message", messages);
  });
});
