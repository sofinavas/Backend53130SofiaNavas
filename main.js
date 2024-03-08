//importo el módulo file system
const fs = require("fs");

//Defino una variable fileProducts que contiene la ruta del archivo fileProducts.json
const fileProducts = "./fileProducts.json";
const productos = [
  {
    title: "Producto1",
    description: "Descripción de producto 1",
    price: 1500,
    thumbnail: "sin imagen",
    code: "COD01",
    stock: 25,
  },
  {
    title: "Producto2",
    description: "Descripción de producto 2",
    price: 1800,
    thumbnail: "sin imagen",
    code: "COD02",
    stock: 25,
  },
  {
    title: "Producto3",
    description: "Descripción de producto 3",
    price: 500,
    thumbnail: "sin imagen",
    code: "COD03",
    stock: 25,
  },
  {
    title: "Producto4",
    description: "Descripción de producto 4",
    price: 2000,
    thumbnail: "sin imagen",
    code: "COD04",
    stock: 25,
  },
  {
    title: "Producto5",
    description: "Descripción de producto 5",
    price: 1900,
    thumbnail: "sin imagen",
    code: "COD05",
    stock: 25,
  },
  {
    title: "Producto6",
    description: "Descripción de producto 6",
    price: 780,
    thumbnail: "sin imagen",
    code: "COD06",
    stock: 25,
  },
  {
    title: "Producto7",
    description: "Descripción de producto 7",
    price: 920,
    thumbnail: "sin imagen",
    code: "COD07",
    stock: 25,
  },
  {
    title: "Producto8",
    description: "Descripción de producto 8",
    price: 4000,
    thumbnail: "sin imagen",
    code: "COD08",
    stock: 25,
  },
  {
    title: "Producto9",
    description: "Descripción de producto 9",
    price: 1560,
    thumbnail: "sin imagen",
    code: "COD09",
    stock: 25,
  },
  {
    title: "Producto10",
    description: "Descripción de producto 10",
    price: 570,
    thumbnail: "sin imagen",
    code: "COD10",
    stock: 25,
  },
];

//Defino la clase ProductManager
class ProductManager {
  //La variable estática esta asociada a la clase. Inicializa en 0
  static ultId = 0;
  //El constructor inicializa las propiedades products y path de la instancia de la clase
  constructor() {
    this.products = [];
    this.path = fileProducts;
  }

  //Método que me retorna los productos:
  //Ojota! Los métodos son funciones asociadas a un objeto.
  //Simplemente me devuelve la lista de productos almacenados en la propiedad products de la instancia de ProductManager.

  getProducts() {
    return this.products;
  }

  //Función para agregar productos que toma como argumentos los detalles del producto
  addProduct(title, description, price, thumbnail, code, stock) {
    // Verificaciones
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }
    if (this.products.some((item) => item.code === code)) {
      console.log("El código debe ser único");
      return;
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
    this.guardarProductos();
  }

  //Agrega este nuevo producto a la lista de productos:
  getProducts() {
    return this.products;
  }

  //Con el método getProductById(id) busco un producto por su ID en la lista de productos. Tomo como argumento el ID del producto que se está buscando y utilizo el método find() para buscar un producto con ese ID en la lista de productos. Si encuentra el producto, lo imprime en la consola. Si no encuentra ningún producto con el ID especificado, imprime "Not Found".

  getProductById(id) {
    const product = this.products.find((item) => item.id === id);

    if (!product) {
      console.log("Not Found");
    } else {
      console.log("Producto encontrado: ", product);
    }
  }

  //Guardo los productos con el trucazo de la NASA
  guardarProductos() {
    fs.writeFile(this.path, JSON.stringify(this.products, null, 2), (error) => {
      if (error) {
        console.error("Error al guardar los productos: ", error);
      }
    });
  }
  updateProduct(id, updatedFields) {
    const i = this.products.findIndex((product) => product.id === id);
    if (i !== -1) {
      this.products[i] = { ...this.products[i], ...updatedFields };
      //Llamo a la funcion para guardar los productos en el archivo
      this.guardarProductos();
    } else {
      console.log("Producto no encontrado.");
    }
  }
  //Creo función para borrar un producto del archivo
  deleteProduct(id) {
    this.products = this.products.filter((product) => product.id !== id);
    //Llamo a la función
    this.guardarProductos();
  }
}

//Ahora creo una INSTANCIA de la clase ProductManager

const manager = new ProductManager();

console.log(manager.getProducts());

manager.addProduct(
  "Rogel",
  "milhojas de dulce de leche",
  10000,
  "sin imagen",
  "COD11",
  20
);

manager.addProduct(
  "Marquise",
  "base de chocolate, relleno de dulce de leche, crema y merengue",
  12000,
  "sin imagen",
  "COD12",
  10
);

manager.addProduct(
  "Lemon Curd",
  "Tarta de crema de lima",
  9000,
  "sin imagen",
  "COD13",
  10
);

//Desafío 1
//TESTING
console.log(manager.getProducts());

console.log(manager.getProductById(2));

console.log(manager.getProductById(8));

//Desafío 2

//TESTING
console.log(manager.getProducts());

//agregar y mostar productos
for (const producto of productos) {
  manager.addProduct(
    producto.title,
    producto.description,
    producto.price,
    producto.thumbnail,
    producto.code,
    producto.stock
  );
}
console.log(manager.getProducts());

//validación de código repetido
manager.addProduct(
  "Producto 1",
  "desccripcion 1 ",
  4500,
  "sin img",
  "COD02",
  789
);
//validaciión de campos faltantes
manager.addProduct("Producto 1", "descripcion 1 ", 4500, "sin img", "COD16");

//buscar productos por id:
manager.getProductById(3);

//producto no encontrado:
manager.getProductById(28);

//eliminar y comprobar
manager.deleteProduct(2);
console.log(manager.getProducts());

//eliminar producto inexistente
manager.deleteProduct(78);

//edito un producto (el 5) y compruebo
manager.updateProduct(1, {
  title: "Producto534",
  description: "Descripción de producto 534",
  price: 2000,
  thumbnail: "se actualiza?",
  code: "COD05",
  stock: 25,
});
console.log(manager.getProducts());

//editar producto inexistente
manager.updateProduct(27, {
  title: "Producto534",
  description: "Descripción de producto 534",
  price: 2000,
  thumbnail: "se actualiza?",
  code: "COD05",
  stock: 25,
});
console.log(manager.getProducts());
