const socket = require("socket.io");

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando el puerto: ${PUERTO}`);
});

const io = socket(httpServer);

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
