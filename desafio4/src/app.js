import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import ProductManager from './ProductManager.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';


//Crear app express y puerto
const app = express();
const PORT = 8080;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Archivos de carpeta public
app.use(express.static(__dirname + '/public'));

//Routes y endpoints de product y cart
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//Router
app.use('/views', viewsRouter);


const httpServer = app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});

const socketServer = new Server(httpServer);

const productManager = new ProductManager(__dirname + "/products.json");

//Obtener los productos del archivo product.json
const products = await productManager.getProducts();

//Config socket.io para que escuche los eventos de conexión y desconexión de clientes
socketServer.on('connection', (socket) => {
    console.log(`Un cliente se ha conectado ${socket.id}`);

    socket.emit('message0', 'Bienvenido! estas conectado con el servidor');

    socket.broadcast.emit('message1', `Un nuevo cliente se ha conectado con id ${socket.id}`);

    socket.on('createProduct', async (product) => {

        const productsPush = products;
        productsPush.push(product);

        socketServer.emit('product-list', productsPush);

        socket.broadcast.emit('message3', `El cliente con id ${socket.id} ha creado un producto`);

        await productManager.addProduct(product);
    });

    socket.on('deleteProduct', async (id) => {

        const productsPush = products.filter((product) => product.id !== id);

        socketServer.emit('product-list', productsPush);

        socket.broadcast.emit('message4', `El cliente con id ${socket.id} ha eliminado un producto con ID ${id}`);

        await productManager.deleteProduct(id);
    });

    socket.on('disconnect', () => {
        console.log(`El cliente con id ${socket.id} se ha desconectado`);
    
        socketServer.emit('message2', `El cliente con id ${socket.id} se ha desconectado`);
    });
});