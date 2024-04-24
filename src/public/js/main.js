const socket = io();

socket.on("productos", (data) => {
  renderProductos(data);
});
//Funcion para rendrizar el listado de productos

const renderProductos = (productos) => {
  const contenedorProductos = document.getElementById("contenedorProductos");
  contenedorProductos.innerHTML = "";

  productos.forEach((item) => {
    const card = document.createElement("div");
    card.innerHTML = `
        <p> ID: ${item.id}</p>
        <p> Nombre: ${item.title}</p>
        <p> Precio: ${item.price}</p>
        <button> Eliminar producto</button>
    `;
    contenedorProductos.appendChild(card);

    //Agrego el evento al button
    card.querySelector("button").addEventListener("click", () => {
      eliminarProducto(item.id);
    });
  });
};

//Eliminar producto:
const eliminarProducto = (id) => {
  socket.emit("eliminarProducto", id);
};

//Agregar producto:

document.getElementById("btnEnviar").addEventListener("click", () => {
  agregarProducto();
});

const agregarProducto = () => {
  const producto = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    img: document.getElementById("img").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: document.getElementById("status").value === true,
  };
  socket.emit("agregarProducto", producto);
};
//Creo una instancia de socket.io desde el lado del cliente

const socket = io();

//Creo una variable para guardar al usuario.
let user;
const chatBox = document.getElementById("chatBox");

//Utilizo Sweet Alert para el mensaje de bienvenida

//Swal es un objeto global que nos permite usar los métodos de la librería.
//Fire es un método que nos permite configurar el alerta.
Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Ingresa un usuario para identificarte en el chat",
  //VAlidaciones:
  inputValidator: (value) => {
    return !value && "Necesitas escribir un nombre para continuar";
  },
  //ahora deshabilito el click por fuera para que si o si tenga que escribir el nombre
  allowOutsideClick: false,
}).then((result) => {
  user = result.value; //concatenamos con el método .then que en el caso que alguien ingresó un dato al imput lo cargue en usuario. (user: va a tener el dato que viene del resultado)
});

chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      //.trim nos permite sacar los espacios en blanco del principio y del final de un string.
      //Si el mensaje tiene más de 0 caracteres, lo enviamos al servidor.
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

//Listener de mensajes:

socket.on("messagesLogs", (data) => {
  const log = document.getElementById("messagesLogs");
  let messages = "";

  data.forEach((message) => {
    messages = messages + `${message.user} dice: ${message.message} <br>`;
  });
  log.innerHTML = messages;
});
