//importo el módulo file system
const fs = require("fs").promises;

//Defino una variable fileProducts que contiene la ruta del archivo fileProducts.json
const fileProducts = "./fileProducts.json";

//Defino la clase ProductManager
class ProductManager {
  //La variable estática esta asociada a la clase. Inicializa en 0
  static ultId = 0;
  //El constructor inicializa las propiedades products y path de la instancia de la clase
  constructor(filePath) {
    this.products = [];
    this.path = filePath || fileProducts;
    this.loadProducts(); //Cargar productos al inicializar la instancia
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path);
      this.products = JSON.parse(data);
      //Calcular el ID máximo para agregar nuevos productos
      const maxId = this.products.reduce(
        (max, product) => Math.max(max, product.id),
        0
      );
      ProductManager.ultId = maxId;
    } catch (err) {
      console.error("Error al cargar los productos", err);
    }
  }
  //Método que me retorna los productos:
  //Ojota! Los métodos son funciones asociadas a un objeto.
  //Simplemente me devuelve la lista de productos almacenados en la propiedad products de la instancia de ProductManager.

  async getProducts() {
    return this.products;
  }

  //Función para agregar productos que toma como argumentos los detalles del producto
  async addProduct(title, description, price, thumbnail, code, stock) {
    // Verificaciones
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("Todos los campos son obligatorios");
    }
    if (this.products.some((item) => item.code === code)) {
      throw new Error("El código debe ser único");
    }
    // Si pasa ambas verificaciones, se crea un nuevo objeto de producto con un ID único generado automáticamente, utilizando ++ProductManager.ultId

    const newProduct = {
      id: ++ProductManager.ultId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(newProduct);
    await this.guardarProductos();
    return newProduct; // Devuelve el producto añadido
  }

  //Con el método getProductById(id) busco un producto por su ID en la lista de productos. Tomo como argumento el ID del producto que se está buscando y utilizo el método find() para buscar un producto con ese ID en la lista de productos.

  async getProductById(id) {
    const product = this.products.find((item) => item.id === id);
    if (!product) {
      throw new Error("Not Found");
    }
    return product;
  }

  //Guardo los productos con el trucazo de la NASA
  async guardarProductos() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (err) {
      console.error("Error al guardar los productos: ", err);
    }
  }

  async updateProduct(id, updatedFields) {
    const i = this.products.findIndex((product) => product.id === id);
    if (i !== -1) {
      this.products[i] = { ...this.products[i], ...updatedFields };
      //Llamo a la funcion para guardar los productos en el archivo
      await this.guardarProductos();
    } else {
      throw new Error("Producto no encontrado.");
    }
  }
  //Creo función para borrar un producto del archivo
  async deleteProduct(id) {
    this.products = this.products.filter((product) => product.id !== id);
    //Llamo a la función
    await this.guardarProductos();
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
