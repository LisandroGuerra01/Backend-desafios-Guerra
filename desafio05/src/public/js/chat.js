import { Swal } from 'sweetalert2';
const socket = io()

const btnSend = document.getElementById('send-message');
const message = document.getElementById('message-area');
const boxMessages = document.getElementById('chat-box');
const tituloUsuario = document.getElementById('nombre-to-name');
const divChat = document.getElementById('chat');

let usuario

//Ingreso al chat - colocar usuario
Swal.fire({
    title: 'Bienvenido',
    text: 'Ingresa tu nombre de usuario',
    input: 'text',
    inputValidator: (value) => {
        if (!value) {
            return 'Necesitas ingresar un nombre de usuario'
        }
    },
}).then((username) => {
    usuario = username.value
    tituloUsuario.innerHTML = `Bienvenido ${usuario} al Chat`
    socket.emit('usuarioNuevo', usuario)
});

btnSend.addEventListener('click', () => {
    if (message.value == '') {
        message.focus();
    } else {
        boxMessages.innerHTML += `
        <!-- MI MENSAJE -->
    <div class="chat from-message">
    <div class="detalles">
        <span>Tú</span>
        <p>${message.value}</p>
    </div>
    </div>
        `;
        scrollBottom();
        socket.emit('message', { user: usuario, msg: message.value });
        message.value = null;
    }
});

// Chat Anterior
socket.on('chat', (mensajes) => {
    console.log(mensajes)

    const chatParrafo = mensajes
        .map((obj) => {
            return `<p>${obj.user}: ${obj.message}</p>`
        })
        .join(' ')

    divChat.innerHTML = chatParrafo
})


/* ENTER KEY  */
function enterkey() {
    keyenter = event.keyCode;
    if (keyenter == 13) {
        btnSend.click();
        scrollBottom();
    }
}
window.onkeydown = enterkey;

function scrollBottom() {
    boxMessages.scrollTop = boxMessages.scrollHeight;
}

/* LISTENER SOCKET */
socket.on("message", (data) => {
    boxMessages.innerHTML += `
<!-- MENSAJE AMIGO -->
<div class="chat to-message">
    <div class="detalles">
        <span>${data.user}</span>
    <p>${data.msg}</p>
    </div>
</div>
`;
    scrollBottom()
});

// notificacion usuario nuevo conectado
socket.on('broadcast', usuario => {
    Toastify({
        text: `${usuario} conectado al chat`,
        duration: 5000,
        position: "right", // `left`, `center` or `right`
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
})