import { faker } from "@faker-js/faker";

const generarProductos = () => {
  const productId = faker.database.mongodbObjectId();
  const productName = faker.commerce.productName();
  const productDescription = faker.commerce.productDescription();
  const productPrice = faker.commerce.price();
  const productStock = faker.number.int({ min: 50, max: 200 });

  const producto = {
    id: productId,
    title: productName,
    description: productDescription,
    price: productPrice,
    stock: productStock,
    thumbnail: "sin img",
    code: faker.string.uuid(),
    category: faker.commerce.department(),
    status: true,
  };

  return producto;
};

export default generarProductos;
