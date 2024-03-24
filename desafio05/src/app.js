import express from 'express';
import MongoStore from 'connect-mongo';
import FileStore from 'session-file-store';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dbConfig from './db/dbConfig.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import usersRouter from './routes/users.router.js';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import { messagesModel } from './db/models/messages.model.js';

const app = express();
const FileStoreSession = FileStore(session);

//JSON settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Archivos estáticos
app.use('/public', express.static(__dirname + '/public/html'))
app.use(express.static(__dirname + '/public'))

//Config de plantillas hbs
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(cookieParser());

const MONGO_URL = "MONGO_URI=mongodb+srv://lisandroguerra01:300naves@cluster0.bhewscs.mongodb.net/ecommerceEntrega2?retryWrites=true&w=majority&appName=Cluster0";

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 60 * 60 * 24 * 7
    }),
    resave: false,
    saveUninitialized: false,
    secret: 'secreto',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

//Rutas
app.use('/views', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/users', usersRouter)

//Redirect a /views/login cuando se acceda a la ruta /
app.get('/', (req, res) => {
    res.redirect('/views/login');
});

app.set("port", process.env.PORT || 8080);

const httpServer = app.listen(app.get("port"), () => {
    console.log(`Server listening on port ${app.get("port")}`);
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
const URI = dbConfig.mongo_uri;

mongoose.connect(URI)
    .then(() => console.log('DB is connected'))
    .catch(error => console.error(error));