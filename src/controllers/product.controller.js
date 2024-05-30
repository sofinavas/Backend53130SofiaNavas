const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();

class ProductController {
  async addProduct(req, res) {
    const nuevoProducto = req.body;
    try {
      const resultado = await productRepository.addProduct(nuevoProducto);
      res.json(resultado);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
  async getProducts(req, res) {
    try {
      let { limit = 10, page = 1, sort, query } = req.query;
      const productos = await productRepository.getProducts(
        limit,
        page,
        sort,
        query
      );
      res.json(productos);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
  async getProductById(req, res) {
    const id = req.params.pid;
    try {
      const buscado = await productRepository.getProductById(id);
      if (!buscado) {
        return res.json({ error: "Producto no encontrado" });
      }
      res.json(buscado);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
  async updateProduct(req, res) {
    try {
      const id = req.params.pid;
      const productoActualizado = req.body;
      const resultado = await productRepository.updateProduct(
        id,
        productoActualizado
      );
      res.json(resultado, { message: "Producto actualizado correctamente" });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
  async deleteProduct(req, res) {
    const id = req.params.pid;
    try {
      let respuesta = await productRepository.deleteProduct(id);
      res.json(respuesta, {
        message: "Producto eliminado exitosamente",
      });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
}
module.exports = ProductController;
