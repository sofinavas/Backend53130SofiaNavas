const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");

//Obtener todos los productos del json:
router.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit;
    const productos = await productManager.getProducts();
    if (limit) {
      res.json(productos.slice(0, limit));
    } else {
      res.json(productos);
    }
  } catch (error) {
    console.error("Error al obtener productos, error");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Obtener un producto por id:
router.get("/products/:pid", async (req, res) => {
  const id = req.params.pid;
  try {
    //Obtener el producto por su ID del ProductManager
    const producto = await productManager.getProductById(parseInt(id));
    if (!producto) {
      return res.json({
        error: "Producto no encontrado",
      });
    }
    res.json(producto);
  } catch (error) {
    console.error("Error al obtener el producto", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Agregar un nuevo producto

router.post("/products", async (req, res) => {
  const nuevoProducto = req.body;

  try {
    await productManager.addProduct(nuevoProducto);
    res.status(201).json({ message: "Producto agregado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Actualizar por id:

router.put("/products/:pid", async (req, res) => {
  const id = req.params.pid;
  const productoActualizado = req.body;
  try {
    await productManager.updateProduct(parseInt(id), productoActualizado);
    res.json({
      message: "Producto actualizado correctamente",
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Eliminar producto:
router.delete("/products/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    await productManager.deleteProduct(parseInt(id));
    res.json({
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
module.exports = router;
