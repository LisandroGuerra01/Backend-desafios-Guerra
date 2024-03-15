import express from 'express';
import './db/dbConfig'
import productRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import { messagesModel } from './db/models/messages.model.js'


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Archivos estáticos
app.use('/public', express.static(__dirname + '/public/html'))
app.use(express.static(__dirname + '/public'))


//Config de plantullas hbs
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//Rutas
app.use('/views', viewsRouter)

app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)

app.set("port", prodess.env.PORT || 8080);


//Escuchar en puerto 8080
const httpServer = app.listen(app.get("port"), () => {
    console.log(`Server listening on port ${app.get("port")}`);
    console.log(`http://localhost:${app.get("port")}`)
});


//Wesocket
const io = new Server(httpServer)

io.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`)

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`)
    })

    socket.on('message', async (data) => {
        const newMessage = new messagesModel({
            user: data.user,
            message: data.msg,
        });
        await newMessage.save();

        socket.broadcast.emit("message", data)
    })

    socket.on('usuarioNuevo', async (usuario) => {
        socket.broadcast.emit("broadcast", usuario)

        const messages = await messagesModel.find();

        socket.emit("chat", messages)
    })
})