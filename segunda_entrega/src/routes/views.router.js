import { Router } from 'express';
import ProductManager from '../Dao/ManagerMongo/ProductManagerMongo.js';
import CartManager from '../Dao/ManagerMongo/CartManagerMongo.js';


const router = Router();

router.get('/', (req, res) => {
    res.render('chat')
})

//Endpoint para visualizar todos los productos
router.get('/products', async (req, res) => {
    const productManager = new ProductManager();
    const products = await productManager.getProducts(5);

    res.render('products', { products });
});

//Endpoint para visualizar todos los productos con paginación
router.get('/products/page/:page', async (req, res) => {
    const page = req.params.page || 1;
    const productManager = new ProductManager();
    const products = await productManager.getProducts(5, page);

    res.render('products', { products });
});

//Endpoint para visualizar un producto por su ID
router.get('/products/:pid', async (req, res) => {
    const productManager = new ProductManager();
    const product = await productManager.getProductById(req.params.pid);

    const { _id, title, description, price, code, stock, category, thumbnail } = product; 

    res.render('product', { _id, title, description, price, code, stock, category, thumbnail });
});

//Endpoint para visualizar el carrito
router.get('/carts/:cid', async (req, res) => {
    const cartManager = new CartManager();
    const cart = await cartManager.getCartById(req.params.cid);

    const { products } = cart;

    res.render('cart', { products });
})

export default router;