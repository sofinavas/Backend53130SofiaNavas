const productModel = require("../models/product.model.js");
const ProductModel = require("../models/product.model.js");

//Defino la clase ProductManager
class ProductManager {
  async addProduct({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
  }) {
    // Verificaciones
    try {
      if (
        !title ||
        !description ||
        !price ||
        !img ||
        !code ||
        !stock ||
        !category
      ) {
        throw new Error("Todos los campos son obligatorios");
        return;
      }
      const existeProducto = await ProductModel.findOne({ code: code });

      if (existeProducto) {
        console.log("El código debe ser único");
        return;
      }

      const newProduct = new ProductModel({
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
      });

      await newProduct.save();
    } catch (error) {
      console.log("Error al agregar un producto, error");
      throw error;
    }
  }
  async getProducts() {
    try {
      const productos = await ProductModel.find();
      return productos;
    } catch (error) {
      console.log("Errror al recuperar los productos", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const producto = await ProductModel.findById(id);

      if (!producto) {
        console.log("Not Found");
        return null;
      } else {
        console.log("Producto encontrado");
        return producto;
      }
    } catch (error) {
      console.log("Error al recuperar el producto por ID", error);
      throw error;
    }
  }

  // Creo una función para actualizar un producto
  async updateProduct(id, productoActualizado) {
    try {
      const updateProduct = await ProductModel.findByIdAndUpdate(
        id,
        productoActualizado
      );

      if (!updateProduct) {
        console.log("Not Found");
        return null;
      }
      console.log("Producto actualizado");
      return updateProduct;
    } catch (error) {
      console.log("Error al actualizar el producto por ID", error);
      throw error;
    }
  }

  //Creo función para borrar un producto del archivo
  async deleteProduct(id) {
    try {
      const deleteProduct = await productModel.findByIdAndDelete(id);

      if (!deleteProduct) {
        console.log("Product Not Found");
        return null;
      }
      console.log("Producto eliminado!");
    } catch (error) {
      console.log("Error al eliminar el producto por ID", error);
      throw error;
    }
  }
}

module.exports = ProductManager;

// //Ahora creo una INSTANCIA de la clase ProductManager

// const manager = new ProductManager();

// console.log(manager.getProducts());

// manager.addProduct(
//   "Fragile",
//   "Base brownie con nueces, dulce de leche, merengue de cacao y almendras tostadas, ganache de chocolate, mousse de chocolate, merengue italiano de cacao y trufas",
//   40000,
//   "sin imagen",
//   "TO11",
//   20
// );

// manager.addProduct(
//   "Marquise",
//   "base de chocolate, relleno de dulce de leche, crema y merengue",
//   12000,
//   "sin imagen",
//   "COD12",
//   10
// );

// manager.addProduct(
//   "Imperial Ruso",
//   "Merengue, dulce de leche, crema chantilly y pionono.",
//   18000,
//   "sin imagen",
//   "TO13",
//   10
// );

// //Desafío 1
// // //TESTING
// // console.log(manager.getProducts());

// // console.log(manager.getProductById(2));

// // console.log(manager.getProductById(8));

// //Desafío 2

// //TESTING
// console.log(manager.getProducts());

// // //agregar y mostar productos
// for (const producto of productos) {
//   manager.addProduct(
//     producto.title,
//     producto.description,
//     producto.price,
//     producto.thumbnail,
//     producto.code,
//     producto.stock
//   );
// }
// console.log(manager.getProducts());

// //validación de código repetido
// // manager.addProduct(
// //   "Producto 1",
// //   "desccripcion 1 ",
// //   4500,
// //   "sin img",
// //   "TO02",
// //   789
// // );
// //validaciión de campos faltantes
// //manager.addProduct("Producto 1", "descripcion 1 ", 4500, "sin img", "TO16");

// //buscar productos por id:
// //manager.getProductById(3);

// //producto no encontrado:
// //manager.getProductById(28);

// //eliminar y comprobar
// //manager.deleteProduct(2);
// // //console.log(manager.getProducts());

// // //eliminar producto inexistente
// // //manager.deleteProduct(78);

// // //edito un producto (el 5) y compruebo
// // manager.updateProduct(1, {
// //   title: "Producto534",
// //   description: "Descripción de producto 534",
// //   price: 2000,
// //   thumbnail: "se actualiza?",
// //   code: "COD05",
// //   stock: 25,
// // });
// // console.log(manager.getProducts());

// // //editar producto inexistente
// // manager.updateProduct(27, {
// //   title: "Producto534",
// //   description: "Descripción de producto 534",
// //   price: 2000,
// //   thumbnail: "se actualiza?",
// //   code: "COD05",
// //   stock: 25,
// // });
