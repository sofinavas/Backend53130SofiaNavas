const socketClient = io();
const nombreUsuario = document.getElementById("nombreusuario");
const formulario = document.getElementById("formulario");
const inputMensaje = document.getElementById("mensaje");
const chat = document.getElementById("chat");

let usuario = null;

if (!usuario) {
  Swal.fire({
    title: "Bienvenido al chat",
    text: "Ingresa tu usuario",
    input: "text",
    inputValidator: (value) => {
      return !value && "Necesitas escribir un nombre para continuar";
    },
    allowOutsideClick: false,
  }).then((username) => {
    usuario = username.value;
    nombreUsuario.innerHTML = usuario;
    socketClient.emit("nuevoUsuario", usuario);
  });
}

function scrollToBottom() {
  const chatContainer = document.getElementById("chat-messages");
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

formulario.onsubmit = (e) => {
  e.preventDefault();
  const info = {
    user: usuario,
    message: inputMensaje.value,
  };
  socketClient.emit("mensaje", info);
  inputMensaje.value = "";
  scrollToBottom();
};

socketClient.on("chat", (mensajes) => {
  const chatRender = mensajes
    .map((mensaje) => {
      const fechaCreacion = new Date(mensaje.createdAt);
      const opcionesHora = { hour: "2-digit", minute: "2-digit" };
      const horaFormateada = fechaCreacion.toLocaleTimeString(
        undefined,
        opcionesHora
      );
      return `<p><strong>${horaFormateada}</strong> - <strong>${mensaje.user}</strong>: ${mensaje.message}</p>`;
    })
    .join("");
  chat.innerHTML = chatRender;
});

socketClient.on("broadcast", (usuario) => {
  Toastify({
    text: `Ingreso ${usuario} al chat`,
    duration: 5000,
    position: "right",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
});

document.getElementById("clearChat").addEventListener("click", () => {
  chat.textContent = "";
  socketClient.emit("clearchat");
});
