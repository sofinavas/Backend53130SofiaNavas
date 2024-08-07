import MessageController from "../controllers/message.controller.js";

const message = new MessageController();

const socketChat = (socketServer) => {
  socketServer.on("connection", async (socket) => {
    console.log("Usuario conectado con ID: " + socket.id);

    socket.on("mensaje", async (info) => {
      await message.createMessage(info);
      socketServer.emit("chat", await message.getMessages());
    });

    socket.on("clearchat", async () => {
      await message.deleteAllMessages();
      socketServer.emit("chat", []);
    });

    socket.on("nuevousuario", (usuario) => {
      socket.broadcast.emit("broadcast", usuario);
    });
  });
};

export default socketChat;
