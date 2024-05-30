const socket = require("socket.io");
const MessageModel = require("../models/message.model.js");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();

class SocketManager {
  constructor(httpServer) {
    this.io = socket(httpServer);
    this.initSocketEvents();
  }

  async initSocketEvents() {
    //genero la conexión:
    this.io.on("connection", async (socket) => {
      console.log("Un cliente conectado");

      //Enviamos el array de productos al cliente:
      socket.emit("productos", await productRepository.getProducts());

      //Recibo el evento "eliminarProducto" desde el cliente:
      socket.on("eliminarProducto", async (id) => {
        await productRepository.deleteProduct(id);
        //Envio el array de productos actualizados:
        this.emitUpdatedProducts(socket);
      });
      //Recibo el evento "agregarProducto" desde el cliente:
      socket.on("agregarProducto", async (producto) => {
        await productRepository.addProduct(producto);
        this.emitUpdatedProducts(socket);
      });
      socket.on("message", async (data) => {
        await MessageModel.create(data);
        const messages = await MessageModel.find();
        socket.emit("message", messages);
      });
    });
  }
  async emitUpdatedProducts(socket) {
    socket.emit("productos", await productRepository.getProducts());
  }
}

module.exports = SocketManager;
