const userModel = require("../models/user.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const ProductRepository = require("../repositories/product.repository.js");

const cartRepository = new CartRepository();
// const ProductRepository = require("../repositories/product.repository.js");
// const productRepository = new ProductRepository();

class CartController {
  // Creo un nuevo carrito:
  async nuevoCarrito(req, res) {
    try {
      const nuevoCarrito = await cartRepository.crearCarrito();
      res.json(nuevoCarrito);
    } catch (error) {
      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }

  // Listar productos que pertenecen a un carrito determinado
  async obtenerProductosDeCarrito(req, res) {
    const cartId = req.params.cid;
    try {
      const productos = await cartRepository.obtenerProductosDeCarrito(cartId);
      if (!productos) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  // Agrego productos a distintos carritos:

  async agregarProductoEnCarrito(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
      await cartRepository.agregarProductoAlCarrito(
        cartId,
        productId,
        quantity
      );
      const carritoID = req.user.cart.toString();
      res.redirect(`/carts/$carritoID`);
    } catch (error) {
      console.error("Error al agregar producto al carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  //Elimiar un determinado producto del carrito:
  async eliminarProductoDeCarrito(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      const updatedCart = await cartRepository.eliminarProductoDelCarrito(
        cartId,
        productId
      );

      res.json({
        status: "success",
        message: "Producto eliminado del carrito correctamente",
        updatedCart,
      });
    } catch (error) {
      console.error("Error al eliminar el producto del carrito", error);
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }
  //Actualizar productos del carrito:
  async actualizarProductosEnCarrito(req, res) {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    // Debes enviar un arreglo de productos en el cuerpo de la solicitud

    try {
      const updatedCart = await cartRepository.actualizarCarrito(
        cartId,
        updatedProducts
      );
      res.json(updatedCart);
    } catch (error) {
      console.error("Error al actualizar el carrito", error);
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }

  //Actualizar cantidades del producto:
  async actualizarCantidad(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;
    try {
      const updatedCart = await cartRepository.actualizarCantidadDeProducto(
        cartId,
        productId,
        newQuantity
      );

      res.json({
        status: "success",
        message: "Cantidad del producto actualizada correctamente",
        updatedCart,
      });
    } catch (error) {
      console.error(
        "Error al actualizar la cantidad del producto en el carrito",
        error
      );
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }
  //Vaciar el carrito:
  async vaciarCarrito(req, res) {
    const cartId = req.params.cid;
    try {
      const updatedCart = await cartRepository.vaciarCarrito(cartId);

      res.json({
        status: "success",
        message:
          "Todos los productos del carrito fueron eliminados correctamente",
        updatedCart,
      });
    } catch (error) {
      console.error("Error al vaciar el carrito", error);
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }
  async finalizarCompra(req, res) {
    const cartId = req.params.cid;
    try {
      //Obtengo el carrito y sus productos
      const cart = await cartRepository.obtenerCarrito(cartId);
      const products = cart.products;

      //Inicializar una arreglo para almacenar los productos no disponibles
      const notAvailableProducts = [];

      //Verificar el stock y actualizar los productos disponibles
      for (const item of products) {
        const productId = item.product;
        const product = await ProductRepository.obtenerProductoPorId(productId);
        if (product.stock < item.quantity) {
          //si hay suficiente stock, restar la cantidad del producto
          product.stock -= item.quantity;
          await product.save();
        } else {
          notAvailableProducts.push(productId);
        }
      }
      const userWithCart = await UserModel.findOne({ cart: cartId });
      //Crear un ticket con los datos de la compra
      const ticket = new TicketModel({
        code: generateUniqueCode(),
        purchase_datetime: new Date(),
        amount: calcularTotal(cart.products),
        purchaser: userWithCart._id,
      });
      await ticket.save();
      //Eliminar el carrito los productos que si se compraron:
      cart.products = cart.products.filter((item) =>
        notAvailableProducts.some(productId.equals(item.product))
      );
      //Guardar el carrito actualizado en la BD
      await cart.save();
      res.status(200).json({ notAvailableProducts });
      await cartRepository.vaciarCarrito(cartId);
      res.json({ ticket });
    } catch (error) {
      console.error("Error al finalizar la compra", error);
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }
}
module.exports = CartController;
