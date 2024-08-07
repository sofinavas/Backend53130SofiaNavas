import messageModel from "../models/message.model.js";

export default class MessageController {
  getMessages = async () => {
    try {
      return await messageModel.find().lean();
    } catch (error) {
      console.log("Error al obtener mensajes", error);
      throw error;
    }
  };

  createMessage = async (message) => {
    if (message.user.trim() === "" || message.message.trim() === "") {
      return null;
    }
    try {
      return await messageModel.create(message);
    } catch (error) {
      console.log("Error al guardar mensaje", error);
      throw error;
    }
  };

  deleteAllMessages = async () => {
    try {
      console.log("Borrando mensajes...");
      const result = await messageModel.deleteMany({});
      console.log("Mensajes borrados:", result);
      return result;
    } catch (error) {
      console.error("Error al borrar mensajes:", error);
      return error;
    }
  };
}
