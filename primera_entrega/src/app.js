import express from 'express';
import __dirname from './utils.js';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';

//Crear app express y puerto
const app = express();
const PORT = 8080;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Archivos de carpeta public
app.use(express.static(__dirname + '/public'));

//Routes y endpoints de product y cart
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);



app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});