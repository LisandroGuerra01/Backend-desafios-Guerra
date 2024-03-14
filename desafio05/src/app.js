import express from 'express';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { messagesModel } from './db/models/messages.model.js';
import config from './config/config.js';

//
const app = express();

//Preparar la config para recibir obj JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Archivos de carpeta public
app.use(express.static(__dirname + '/public'));


//Configurar el motor de plantillas para usar handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


//Routes y endpoints de product y cart
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

//Router
app.use('/views', viewsRouter)

// redirigir a /views/login cuando se acceda a la ruta /
app.get('/', (req, res) => {
    res.redirect('/views/login');
});


// Port para el servidor (8080) o el puerto definido en las variables de entorno (process.env.PORT)
app.set("port", process.env.PORT || 8080);

// Escuchar en el puerto 8080 y mostrar un mensaje en la consola cuando el servidor esté inicializado (listening)
const httpServer = app.listen(app.get("port"), () => {
    console.log('Servidor iniciado en el puerto: ', app.get("port"));
});


//Websocket
const io = new Server(httpServer)

io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`)

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`)
    })

    socket.on("message", async (data) => {

        const newMessage = new messagesModel({
            user: data.user,
            message: data.msg,
        });
        await newMessage.save();

        socket.broadcast.emit("message", data)
    })

    socket.on('usuarioNuevo', async (usuario) => {
        socket.broadcast.emit('broadcast', usuario)

        const messages = await messagesModel.find();

        socket.emit('chat', messages)
    })
})

//Conexión a la db
const URI = config.mongo_uri;

mongoose.connect(URI)
    .then(() => console.log('DB is connected'))
    .catch(error => console.error(error));