const express = require("express");
const router = express.Router();

//Creo una instancia de ProductManager para traerme el archivo con los productos:

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");
router.get("/", async (req, res) => {
  try {
    //recibo los productos a partir del método getProducts que tengo en el manejador de productos
    const productos = await productManager.getProducts();
    //lo envio con el método render (renderizando en el home)
    res.render("home", { productos: productos });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
