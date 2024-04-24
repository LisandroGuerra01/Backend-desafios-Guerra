import express from 'express';
import './dal/dbConfig.js';
import { __dirname } from './utils/dirname.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import apiRoutes from './routes/api.routes.js';
import viewsRouter from './routes/views.router.js';
import { messagesModel } from './dal/models/messages.model.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import FileStore from 'session-file-store';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import './passport/passportStrategies.js'
import cors from 'cors';
import config from './config/config.js';

const PORT = config.PORT;
const URI = config.MONGO_ATLAS_URL;

const app = express();

const FileStoreSession = FileStore(session);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public/html'));
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(cors());

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(session({
    store: new MongoStore.create({
        mongoUrl: URI,
    }),
    resave: false,
    saveUninitialized: false,
    secret: 'secreto',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } //1 semana
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', viewsRouter);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.set("port", PORT || 9090);

const httpServer = app.listen(app.get("port"), () => {
    console.log('Servidor iniciado en el puerto: ', app.get("port"));
    console.log(`http://localhost:${app.get("port")}`);
});

// websocket

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