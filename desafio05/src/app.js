import express from 'express';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import usersRouter from './routes/users.router.js';
import viewsRouter from './routes/views.router.js';
const app = express();

//Preparar la config para recibir ibj JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Archivos de carpeta public
app.use(express.static(__dirname + '/public'));

//Routes y endpoints de product y cart
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/users', usersRouter);


//Configurar el motor de plantillas para usar handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//Router
app.use('/views', viewsRouter)


//Corremos el server
const SERVER_PORT = 9090;
app.listen(SERVER_PORT, () => {
    console.log(`Server listening on port ${SERVER_PORT}`);
});


//Conexión a la db
const DB_URL = 'mongodb+srv://lisandroguerra01:300naves@cluster0.bhewscs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const connectMongoDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error("No se pudo conectar con MongoDB " + error);
        process.exit(); //Terminar el proceso si no se pudo conectar a la db
    }
}
connectMongoDB();