import { cartModel } from "../models/cart.model.js";
import { TicketModel } from "../models/ticket.model.js";
import { productsModel } from "../models/products.model.js";
import EmailManager from "../services/email.js";
import logger from "../utils/logger.js";

const emailManager = new EmailManager();

class CartController {
  async createCart(req, res) {
    try {
      const nuevoCarrito = await cartModel.create({ products: [] });
      logger.info("Carrito creado:", nuevoCarrito);
      return nuevoCarrito;
    } catch (error) {
      logger.error("Error al crear el carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getCartById(req, res) {
    const cartId = req.params.cid;
    try {
      const carrito = await cartModel
        .findById(cartId)
        .populate("products.product");
      if (!carrito) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      res.json(carrito);
    } catch (error) {
      logger.error("Error al obtener el carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async addProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;
    const userId = req.user.email;

    try {
      const parsedQuantity = parseInt(quantity, 10);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return res
          .status(400)
          .json({ error: "Cantidad debe ser un número positivo." });
      }

      const carrito = await cartModel.findById(cartId);
      if (!carrito) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const product = await productsModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      if (
        req.user.role === "premium" &&
        product.owner.toString() === userId.toString()
      ) {
        return res
          .status(403)
          .json({ error: "No puedes agregar tu propio producto al carrito" });
      }

      const productIndex = carrito.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex !== -1) {
        carrito.products[productIndex].quantity += parsedQuantity;
      } else {
        carrito.products.push({ product: productId, quantity: parsedQuantity });
      }

      await carrito.save();
      logger.info(`Producto agregado al carrito ${cartId}`, {
        productId,
        quantity: parsedQuantity,
      });
      res.json(carrito);
    } catch (error) {
      logger.error("Error al agregar producto al carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async deleteProductFromCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
      const carrito = await cartModel.findById(cartId);
      if (!carrito) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      carrito.products = carrito.products.filter(
        (product) => product.product.toString() !== productId
      );
      await carrito.save();
      logger.info(`Producto ${productId} eliminado del carrito ${cartId}`);
      res.json(carrito);
    } catch (error) {
      logger.error("Error al eliminar producto del carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateCart(req, res) {
    const cartId = req.params.cid;
    const { products } = req.body;

    try {
      const carrito = await cartModel
        .findByIdAndUpdate(cartId, { products }, { new: true })
        .populate("products.product");
      if (!carrito) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      logger.info(`Carrito ${cartId} actualizado`, { products });
      res.json(carrito);
    } catch (error) {
      logger.error("Error al actualizar el carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateProductQuantity(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
      const carrito = await cartModel.findById(cartId);
      if (!carrito) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productToUpdate = carrito.products.find(
        (product) => product.product.toString() === productId
      );
      if (productToUpdate) {
        productToUpdate.quantity = quantity;
        await carrito.save();
        logger.info(
          `Cantidad del producto ${productId} en el carrito ${cartId} actualizada a ${quantity}`
        );
      }

      res.json(carrito);
    } catch (error) {
      logger.error(
        "Error al actualizar la cantidad del producto en el carrito:",
        error
      );
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async deleteAllProductsFromCart(req, res) {
    const cartId = req.params.cid;

    try {
      const carrito = await cartModel
        .findByIdAndUpdate(cartId, { products: [] }, { new: true })
        .populate("products.product");
      if (!carrito) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      logger.info(`Todos los productos del carrito ${cartId} eliminados`);
      res.json(carrito);
    } catch (error) {
      logger.error("Error al eliminar todos los productos del carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async purchaseCart(req, res, next) {
    try {
      const { cid } = req.params;
      const cart = await cartModel.findById(cid).populate("products.product");

      if (!cart) {
        logger.warning(
          "Carrito no encontrado al intentar realizar la compra:",
          cid
        );
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productsToPurchase = [];
      const productsOffStock = [];
      let totalAmount = 0;

      for (const item of cart.products) {
        const product = item.product;
        const quantity = item.quantity;

        if (product.stock >= quantity) {
          product.stock -= quantity;
          await product.save();
          productsToPurchase.push({ product: product._id, quantity });
          totalAmount += product.price * quantity;
        } else {
          logger.warning(`Producto ${product.title} no tiene suficiente stock`);
          productsOffStock.push({
            product: product._id,
            title: product.title,
            quantity,
          });
        }
      }

      if (productsToPurchase.length > 0) {
        const ticket = new TicketModel({
          amount: totalAmount,
          purchaser: req.user.email,
        });

        const firstName = req.user.first_name;

        emailManager.enviarCorreoCompra(firstName, ticket);

        await ticket.save();

        cart.products = [];

        for (const item of productsOffStock) {
          cart.products.push({
            product: item.product,
            quantity: item.quantity,
          });
        }

        await cart.save();

        logger.info("Compra completada con éxito.");

        res.status(200).json({
          message: "Compra completada con éxito",
          ticket,
          productsOffStock,
        });
      } else {
        logger.error("Error al realizar la compra: No hay suficiente stock");
        next({ code: "INSUFFICIENT_STOCK" });
      }
    } catch (error) {
      logger.error("Error al realizar la compra:", error);
      res.status(500).json({ error: "Error al realizar la compra" });
    }
  }
}

export default CartController;
