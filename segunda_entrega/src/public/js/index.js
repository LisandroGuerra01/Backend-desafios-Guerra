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
    title: 'Bienvenido!',
    text: 'Ingrese su nombre de usuario',
    input: 'text',
    inputValidator: (value) => {
        if (!value) {
            return 'Por favor ingrese su nombre de usuario'
        }
    }
}).then((username) => {
    usuario = username.value
    tituloUsuario.innerHTML = `Bienvenido${usuario} al chat`

    socket.emit('usuarioNuevo', usuario)
})

btnSend.addEventListener('click', () => {
    if (message.value == "") {
        message.focus();
    } else {
        boxMessages.innerHTML += `
    <div class="chat from-message">
    <div class="detalles">
        <span>Tú</span>
    <p>${message.value}</p>
    </div>
    </div>
    `;
        scrollBBottom();
        socket.emit('message', { user: usuario, msg: message.value });
        message.value = null;
    }
});

socket.on('chat', (mensajes) => {
    console.log(mensajes)

    const chatParrafo = mensajes
        .map((obj) => {
            return `<p>${obj.user}: ${obj.message}</p>`
        })
        .join(' ')

    divChat.innerHTML = chatParrafo
})

function enterkey() {
    keyenter = event.keycode;
    if (keyenter == 13) {
        btnSend.click();
        scrollBBottom();
    }
}
window.onkeydown = enterkey;

function scrollBBottom() {
    boxMessages.scrollTop = boxMessages.scrollHeight;
}

/* LISTENER SOCKET */
socket.on('message', (data) => {
    boxMessages.innerHTML += `
    <div class="chat to-message">
    <div class="detalles">
        <span>${data.user}</span>
    <p>${data.msg}</p>
    </div>
    </div>
    `;
    scrollBBottom();
});

//Notificación usuario nuevo conectado
socket.on('broadcast', usuario => {
    Toastify({
        text: `${usuario} conectado al chat`,
        duration: 5000,
        position: 'right',
        style: {
            background: 'linear-gradient(to right, #00b09b, #96c93d)'
        }
    }).showToast();
})