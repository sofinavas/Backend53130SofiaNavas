import ProductController from "../controllers/product.controller.js";
import { __dirname } from "../utils.js";

const productController = new ProductController();

const socketProducts = (socketServer) => {
  socketServer.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");

    try {
      const listaDeProductos = await productController.getProductsView();
      console.log("Enviando lista de productos inicial:", listaDeProductos);
      socket.emit("enviodeproducts", listaDeProductos);
    } catch (error) {
      console.error("Error fetching products on connection:", error);
      socket.emit("error", "Error fetching products.");
    }

    socket.on("requestProducts", async () => {
      try {
        const listaDeProductos = await productController.getProductsView();
        console.log(
          "Enviando lista de productos por solicitud:",
          listaDeProductos
        );
        socket.emit("enviodeproducts", listaDeProductos);
      } catch (error) {
        console.error("Error fetching products on request:", error);
        socket.emit("error", "Error fetching products.");
      }
    });

    socket.on("addProduct", async (obj) => {
      console.log("Añadiendo nuevo producto:", obj);
      try {
        await productController.addProduct(obj);
        const listaDeProductos = await productController.getProductsView();
        console.log(
          "Lista de productos actualizada después de añadir:",
          listaDeProductos
        );
        socketServer.emit("enviodeproducts", listaDeProductos);
      } catch (error) {
        console.error("Error adding product:", error);
        socket.emit("error", "Error adding product.");
      }
    });

    socket.on("deleteProduct", async (id) => {
      console.log("Eliminando producto con ID:", id);
      try {
        await productController.deleteProduct(id);
        const listaDeProductos = await productController.getProductsView();
        console.log(
          "Lista de productos actualizada después de eliminar:",
          listaDeProductos
        );
        socketServer.emit("enviodeproducts", listaDeProductos);
      } catch (error) {
        console.error("Error deleting product:", error);
        socket.emit("error", "Error deleting product.");
      }
    });

    socket.on("updateProduct", async (updatedProduct) => {
      console.log("Actualizando producto:", updatedProduct);
      try {
        const { id, ...productoActualizado } = updatedProduct; // Extraer los campos correctamente
        const updatedResult = await productController.updateProduct(
          id,
          productoActualizado
        );
        console.log("Resultado de la actualización:", updatedResult);

        if (updatedResult) {
          socket.emit("productUpdated", updatedResult);
        } else {
          socket.emit("productUpdateFailed", {
            message: `Producto con ID ${id} no encontrado`,
          });
        }
      } catch (error) {
        console.error(
          `Error al procesar la actualización del producto con ID ${updatedProduct.id}:`,
          error
        );
        socket.emit("productUpdateFailed", { message: error.message });
      }
    });

    socket.on("requestProducts", async () => {
      try {
        const listaDeProductos = await productController.getProductsView();
        console.log(
          "Enviando lista de productos por solicitud:",
          listaDeProductos
        );
        socket.emit("enviodeproducts", listaDeProductos);
      } catch (error) {
        console.error("Error fetching products on request:", error);
        socket.emit("error", "Error fetching products.");
      }
    });

    socket.on("error", (error) => {
      console.error("Socket server error:", error);
    });
  });
};

export default socketProducts;
