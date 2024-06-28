const ProductModel = require("../models/product.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();

class ViewsController {
  async renderProducts(req, res) {
    try {
      const { page = 1, limit = 3 } = req.query; // Valores por defecto: página 1, límite 3 productos por página
      const skip = (page - 1) * limit; // Calcular cuántos documentos omitir para la paginación
      const productos = await ProductModel.find().skip(skip).limit(limit); // Obtener productos paginados
      //Utiliza ProductModel.find() para obtener los productos de la base de datos, omitiendo los primeros skip documentos y limitando los resultados a limit documentos.
      const totalProducts = await ProductModel.countDocuments(); // Contar el total de productos

      const totalPages = Math.ceil(totalProducts / limit); // Calcular el número total de páginas

      // Determinar si hay una página anterior y siguiente
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      // Mapear los productos para convertirlos a objetos y agregar el ID
      const nuevoArray = productos.map((producto) => {
        const { _id, ...rest } = producto.toObject(); // Convertir documento a objeto y separar el _id
        return { id: _id, ...rest }; // Retornar un nuevo objeto con el ID agregado
      });

      const cartId = req.user.cart.toString();
      res.render("products", {
        productos: nuevoArray,
        hasPrevPage,
        hasNextPage,
        prevPage: page > 1 ? parseInt(page) - 1 : null,
        nextPage: page < totalPages ? parseInt(page) + 1 : null,
        currentPage: parseInt(page),
        totalPages,
        cartId,
      });
    } catch (error) {
      console.error("Error al obtener los productos", error);
      res.status(500).json({
        status: "error",
        error: "Internal Server Error",
      });
    }
  }
  async renderCart(req, res) {
    const cartId = req.params.cid;
    try {
      const carrito = await cartRepository.getCarritoById(cartId);
      if (!carrito) {
        console.log("No existe carrito con el id");
        return res.status(404).json({ error: "carrito no encontrado" });
      }
      let totalCompra = 0;

      const productosEnCarrito = carrito.products.map((item) => {
        const product = item.product.toObject();
        //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars.
        const quantity = item.quantity;
        const totalPrice = product.price * quantity;
        totalCompra += totalPrice;
        return {
          product: { ...product, totalPrice },
          quantity,
          cartId,
        };
      });

      res.render("carts", {
        productos: productosEnCarrito,
        totalCompra,
        cartId,
      });
    } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  async renderLogin(req, res) {
    res.render("login");
  }
  async renderRegister(rq, res) {
    res.render("register");
  }
  async renderRealTimeProducts(req, res) {
    try {
      res.render("realtimeproducts");
    } catch (error) {
      console.log("error en la vista realtime", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async renderHome(req, res) {
    res.render("home");
  }
  async renderChat(req, res) {
    res.render("chat");
  }
}
module.exports = ViewsController;
