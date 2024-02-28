class ProductManager {
  static ultId = 0;
  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }
    if (this.products.some((item) => item.code === code)) {
      console.log("El código debe ser único");
      return;
    }
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
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((item) => item.id === id);

    if (!product) {
      console.log("Not Found");
    } else {
      console.log(product);
    }
  }
}

const manager = new ProductManager();

console.log(manager.getProducts());

manager.addProduct(
  "Rogel",
  "milhojas de dulce de leche",
  10000,
  "sin imagen",
  "t01",
  20
);

manager.addProduct(
  "Marquise",
  "base de chocolate, relleno de dulce de leche, crema y merengue",
  12000,
  "sin imagen",
  "t02",
  10
);

manager.addProduct(
  "Lemon Curd",
  "Tarta de crema de lima",
  9000,
  "sin imagen",
  "t03",
  10
);

console.log(manager.getProducts());

console.log(manager.getProductById(2));

console.log(manager.getProductById(8));
