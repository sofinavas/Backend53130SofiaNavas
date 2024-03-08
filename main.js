//importo el módulo file system
const fs = require("fs");

//Defino una variable fileProducts que contiene la ruta del archivo fileProducts.json
const fileProducts = "./fileProducts.json";
const productos = [
  {
    title: "Tiramisu",
    description:
      "Vainillas embebidas en almíbar de café y coñac con suave crema de queso, espolvoreado con cacao amargo.",
    price: 24000,
    thumbnail: "sin imagen",
    code: "TO01",
    stock: 25,
  },
  {
    title: "Milhojas",
    description: "Milhojas de dulce de leche cubierta con merengue italiano.",
    price: 32000,
    thumbnail: "sin imagen",
    code: "TO02",
    stock: 25,
  },
  {
    title: "Cheesecake",
    description:
      "Base de galletitas molidas, crema de queso blanco y mermelada de frutos rojos.",
    price: 18000,
    thumbnail: "sin imagen",
    code: "TO03",
    stock: 25,
  },
  {
    title: "Chajá",
    description:
      "Bizcochuelo de vainilla humedecido con almíbar de Oporto, crema chantillí, duraznos, dulce de leche y merengue partido.",
    price: 33000,
    thumbnail: "sin imagen",
    code: "TO04",
    stock: 25,
  },
  {
    title: "Semi desnuda (NAKED)",
    description:
      "Bizcochuelo de vainilla o chocolate humedecidos con almíbar.Las tortas pueden tener de 2 a 3 cortes según el tamaño.  Los rellenos pueden ser: dulce de leche, ganache de chocolate, mousse de dulce de leche, mousse de chocolate, crema chantilly, crema moka.  Fruta según la estación: frutillas, duraznos, etc. Fruta seca: almendras tostadas, nueces, avellanas, castañas de cajú. Merenguitos, merengue de cacao, merengue de coco, chips de chocolate, galletitas oreo. La cubierta es de buttercream (crema a base de manteca y merengue italiano.  El tamaño más chico es de 1.5kg. El precio es por kilo",
    price: 21000,
    thumbnail: "sin imagen",
    code: "TO05",
    stock: 25,
  },
  {
    title: "Concorde",
    description:
      "Discos de merengue de cacao y mousse de chocolate con leche cubierta con bastoncitos de merengue de cacao. ",
    price: 33000,
    thumbnail: "sin imagen",
    code: "TO06",
    stock: 25,
  },
  {
    title: "Chocotorta",
    description:
      "Galletitas chocolinas con crema de dulce de leche y queso blanco, decorada con virutas de chocolate.",
    price: 21000,
    thumbnail: "sin imagen",
    code: "TO07",
    stock: 25,
  },
  {
    title: "Marquise",
    description:
      "Base húmeda de chocolate, dulce de leche, crema y merengue italiano.",
    price: 30000,
    thumbnail: "sin imagen",
    code: "TO08",
    stock: 25,
  },
  {
    title: "Torta BUTTERCREAM",
    description:
      "Bizcochuelo de vainilla o chocolate humedecidos con almíbar. Las tortas pueden tener de 2 a 3 cortes según el tamaño.  Los rellenos pueden ser: dulce de leche, ganache de chocolate, mousse de dulce de leche, mousse de chocolate, crema chantilly, crema moka.  Fruta según la estación: frutillas, duraznos, etc. Fruta seca: almendras tostadas, nueces, avellanas, castañas de cajú. Merenguitos, merengue de cacao, merengue de coco, chips de chocolate, galletitas oreo. La cubierta es de buttercream de color.  El tamaño más chico es de 1.5kg. El precio es por kilo",
    price: 25000,
    thumbnail: "sin imagen",
    code: "TO09",
    stock: 25,
  },
  {
    title: "Selva Negra",
    description:
      "Bizcochuelo de chocolate húmedo do con almíbar de kirch, crema chantilly, cerezas al marraschino y virutas de chocolate.",
    price: 21000,
    thumbnail: "sin imagen",
    code: "TO10",
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
  "Fragile",
  "Base brownie con nueces, dulce de leche, merengue de cacao y almendras tostadas, ganache de chocolate, mousse de chocolate, merengue italiano de cacao y trufas",
  40000,
  "sin imagen",
  "TO11",
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
  "Imperial Ruso",
  "Merengue, dulce de leche, crema chantilly y pionono.",
  18000,
  "sin imagen",
  "TO13",
  10
);

//Desafío 1
// //TESTING
// console.log(manager.getProducts());

// console.log(manager.getProductById(2));

// console.log(manager.getProductById(8));

//Desafío 2

//TESTING
console.log(manager.getProducts());

// //agregar y mostar productos
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
// manager.addProduct(
//   "Producto 1",
//   "desccripcion 1 ",
//   4500,
//   "sin img",
//   "TO02",
//   789
// );
//validaciión de campos faltantes
//manager.addProduct("Producto 1", "descripcion 1 ", 4500, "sin img", "TO16");

//buscar productos por id:
//manager.getProductById(3);

//producto no encontrado:
//manager.getProductById(28);

//eliminar y comprobar
//manager.deleteProduct(2);
// //console.log(manager.getProducts());

// //eliminar producto inexistente
// //manager.deleteProduct(78);

// //edito un producto (el 5) y compruebo
// manager.updateProduct(1, {
//   title: "Producto534",
//   description: "Descripción de producto 534",
//   price: 2000,
//   thumbnail: "se actualiza?",
//   code: "COD05",
//   stock: 25,
// });
// console.log(manager.getProducts());

// //editar producto inexistente
// manager.updateProduct(27, {
//   title: "Producto534",
//   description: "Descripción de producto 534",
//   price: 2000,
//   thumbnail: "se actualiza?",
//   code: "COD05",
//   stock: 25,
// });
