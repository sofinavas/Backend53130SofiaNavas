const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager();

//Listar todos los productos:
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const productos = await productManager.getProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query,
    });

    res.json({
      status: "success",
      payload: productos,
      totalPages: productos.totalPages,
      prevPage: productos.prevPage,
      nextPage: productos.nextPage,
      page: productos.page,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevLink: productos.hasPrevPage
        ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: productos.hasNextPage
        ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}`
        : null,
    });
  } catch (error) {
    console.error("Error al obtener productos", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

//Obtener un producto por id:
router.get("/:pid", async (req, res) => {
  const id = req.params.pid;
  try {
    //Obtener el producto por su ID del ProductManager
    const producto = await productManager.getProductById(id);
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

router.post("/", async (req, res) => {
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
    await productManager.updateProduct(id, productoActualizado);
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
    await productManager.deleteProduct(id);
    res.json({
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
module.exports = router;
