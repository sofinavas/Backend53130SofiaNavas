//Funcion para generar un código unico para el ticket
const generateUniqueCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const codeLength = 8;
  let code = "";
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  const timestamp = Date.now().toString(36);
  return code + "_" + timestamp;
};
//Funcion para calcular el total de la compra
const calculateTotal = (products) => {
  let total = 0;
  products.forEach((item) => {
    total += item.product.price * item.quantity;
  });
  return total;
};

module.exports = { generateUniqueCode, calculateTotal };
