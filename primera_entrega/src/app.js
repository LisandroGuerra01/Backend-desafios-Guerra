import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import __dirname from './utils.js';


//Crear app express y puerto
const app = express();
const PORT = 8080;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Archivos de carpeta public
app.use(express.static(__dirname + '/src/public'));

//Routes y endpoints de product y cart
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});