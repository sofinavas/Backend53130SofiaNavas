const express = require("express");
const router = express.Router();

//Creo una instancia de ProductManager para traerme el archivo con los productos:

const ProductManager = require("../controllers/product-manager.js");
const CartManager = require("../controllers/cart-manager.js");
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 2 } = req.query;
    //recibo los productos a partir del método getProducts que tengo en el manejador de productos

    const productos = await productManager.getProducts({
      page: parseInt(page),
      limit: parseInt(limit),
    });
    const nuevoArray = productos.docs.map((producto) => {
      const { _id, ...rest } = producto.toObject();
      return rest;
    });

    res.render("products", {
      user: req.session.user,
      productos: nuevoArray,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevPage: productos.prevPage,
      nextPage: productos.nextPage,
      currentPage: productos.page,
      totalPages: productos.totalPages,
    });
  } catch (error) {
    console.error("Error al obtener productos", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const carrito = await cartManager.getCarritoById(cartId);

    if (!carrito) {
      console.log("No existe ese carrito con el id");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productosEnCarrito = carrito.products.map((item) => ({
      product: item.product.toObject(),
      //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars.
      quantity: item.quantity,
    }));

    res.render("carts", { productos: productosEnCarrito });
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/login", (req, res) => {
  //Verifico que el user esta logueado y redirige a la pagina de perfil
  if (req.session.login) {
    return res.redirect("/products");
  }

  res.render("login");
});

//Ruta para el formulario de registro:
router.get("/register", (req, res) => {
  if (req.session.login) {
    return res.redirect("/profile");
  }
  res.render("register");
});

//Ruta para la vista de perfil:
router.get("/profile", (req, res) => {
  if (!req.session.login) {
    return res.redirect("/login");
  }

  //Renderizo la vista de perfil con los datos del user
  res.render("profile", { user: req.session.user });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

router.get("/chat", async (req, res) => {
  res.render("chat");
});

module.exports = router;
