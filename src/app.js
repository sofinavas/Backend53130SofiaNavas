const express = require("express"); //importo el módulo de express
const ProductManager = require("./productManager.js"); //importo la clase ProductManager
const PUERTO = 8080; //importo el puerto
const app = express(); //Creo una instancia de la aplicacion de express
const path = require("path"); //importo 'path', módulo de Node.js que proporciona utilidades para trabajar con rutas de archivos y directorios
const products = new ProductManager(
  path.join(__dirname, "./fileProducts.json")
); //.join se usa para unir varias partes de una ruta de archivo en una sola ruta.
//__dirname es una variable global de Node.js que contiene la ruta del directorio actual del archivo en el que se encuentra el cósdigo.

//rutas
app.get("/", (req, res) => {
  res.send("Bienvendos a la Pastelería");
});
// ProductManagerInstance = new ProductManager();
// app.get("/products", (req, res) => {
//   res.send(ProductManagerInstance);
// });

//definir ruta para el endpoint /products:
app.get("/products", async (req, res) => {
  try {
    //Obtener lista de productos del ProductManager
    const productList = await products.getProducts();
    //Obtener el limite de resultados del query param 'limit'
    const { limit } = req.query;
    //Si no se proporciona un limite, devolver todos los productos
    if (!limit) {
      res.json(productList);
    } else {
      //Si proporciona limite, devolver solo el numero de productos solicitados
      const limitNumber = parseInt(limit);
      if (!isNaN(limitNumber) && limitNumber > 0) {
        res.json(productList.slice(0, limitNumber));
      } else {
        //si no es un numero valido, devolver el error
        res.status(400).send(`El limite ${limit} es inválido.`);
      }
    }
  } catch (error) {
    //si ocurre un error al obtener los productos, devolver un error 500
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/products/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    //Obtener el producto por su ID del ProductManager
    const product = await products.getProductById(productId);
    //Devolver el producto encontrado
    res.json(product);
  } catch (error) {
    //Si el producto no se encuentra, devolver un error 404
    console.error(error);
    res.status(404).send("Producto no encontrado");
  }
});
//Inicializar el servidor y escuchar en el puerto definido
app.listen(PUERTO, () => {
  console.log(`Escuchando en el http://localhost:${PUERTO}`);
});
