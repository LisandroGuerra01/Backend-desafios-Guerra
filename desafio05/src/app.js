import express from 'express';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import usersRouter from './routes/users.router.js';
import viewsRouter from './routes/views.router.js';
import { messagesModel } from './db/models/messages.model.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import FileStore from 'session-file-store';
import MongoStore from 'connect-mongo';


const app = express();

//FileStore para guardar las sesiones en el servidor (en archivos)
const FileStoreSession = FileStore(session);

//Preparar la config para recibir ibj JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cookie-parser para analizar las cookies de la solicitud HTTP y asignarlas a req.cookies
app.use(cookieParser());

//Archivos de carpeta public
app.use(express.static(__dirname + '/public'));


//Configurar el motor de plantillas para usar handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


//session para manejar sesiones de usuario en el servidor (cookies) usando MongoStore para guardar las sesiones en la base de datos (en una colección)
app.use(session({
    store: MongoStore.create({
        // nombre de la base de datos donde se guardarán las sesiones
        mongoUrl: 'mongodb+srv://test:coderHouse@steveo.bxgkikt.mongodb.net/ecommerce?retryWrites=true&w=majority',
        //ttl: 60 * 60 * 24 * 7, // 1 semana
    }),
    // resave es false para que no se guarde la sesión en cada petición
    resave: false,
    // saveUninitialized es false para que no se guarde la sesión en cada petición si no hay cambios en la sesión
    saveUninitialized: false,
    // secret es una cadena de texto que se usa para firmar la cookie de sesión
    secret: 'secreto',
    // maxAge es el tiempo de vida de la cookie de sesión en milisegundos
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 1 semana
}));


//Routes y endpoints de product y cart
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/users', usersRouter);

//Router
app.use('/views', viewsRouter)

// redirigir a /views/login cuando se acceda a la ruta /
app.get('/', (req, res) => {
    res.redirect('/views/login');
});


// port para el servidor (8080) o el puerto definido en las variables de entorno (process.env.PORT)
app.set("port", process.env.PORT || 8080);

// escuchar en el puerto 8080 y mostrar un mensaje en la consola cuando el servidor esté inicializado (listening)
const httpServer = app.listen(app.get("port"), () => {
    console.log('Servidor iniciado en el puerto: ', app.get("port"));
    console.log(`http://localhost:${app.get("port")}`);
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
const URI = '';

mongoose.connect(URI)
    .then(() => console.log('DB is connected'))
    .catch(error => console.error(error));