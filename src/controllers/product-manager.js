//importo el módulo file system
const fs = require("fs").promises;

//Defino la clase ProductManager
class ProductManager {
  //La variable estática esta asociada a la clase. Inicializa en 0
  static ultId = 0;
  //El constructor inicializa las propiedades products y path de la instancia de la clase
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  //Función para agregar productos que toma como argumentos los detalles del producto
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
      const arrayProductos = await this.leerArchivo();

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
      if (arrayProductos.some((item) => item.code === code)) {
        throw new Error("El código debe ser único");
        return;
      }
      const newProduct = {
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
      };
      if (arrayProductos.length > 0) {
        ProductManager.ultId = arrayProductos.reduce(
          (maxId, product) => Math.max(maxId, product.id),
          0
        );
      } // Si pasa ambas verificaciones, se crea un nuevo objeto de producto con un ID único generado automáticamente, utilizando ++ProductManager.ultId
      newProduct.id = ++ProductManager.ultId;

      arrayProductos.push(newProduct);
      await this.guardarArchivo(arrayProductos);
    } catch (error) {
      console.log("Error al leer el archivo, error");
      throw error;
    }
  }
  //Con el método getProductById(id) busco un producto por su ID en la lista de productos. Tomo como argumento el ID del producto que se está buscando y utilizo el método find() para buscar un producto con ese ID en la lista de productos.

  async getProductById() {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find((item) => item.id === id);

      if (!buscado) {
        console.log("Not Found");
        return null;
      } else {
        console.log("Producto encontrado");
        return buscado;
      }
    } catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
  }
  //Guardo los productos con el trucazo de la NASA
  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer el archivo ", error);
      throw error;
    }
  }

  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("Error al guardar un producto", error);
      throw error;
    }
  }

  // Creo una función para actualizar un producto
  async updateProduct(id, productoActualizado) {
    try {
      const arrayProductos = await this.leerArchivo();

      const index = arrayProductos.findIndex((item) => item.id === id);

      if (index !== -1) {
        arrayProductos[index] = {
          ...arrayProductos[index],
          ...productoActualizado,
        };
        await this.guardarArchivo(arrayProductos);
        console.log("Producto actualizado");
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
      throw error;
    }
  }

  //Creo función para borrar un producto del archivo
  async deleteProduct(id) {
    try {
      const arrayProductos = await this.leerArchivo();

      const index = arrayProductos.findIndex((item) => item.id === id);

      if (index !== -1) {
        arrayProductos.splice(index, 1);
        await this.guardarArchivo(arrayProductos);
        console.log("Producto eliminado");
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
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
