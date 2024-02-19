import { Router } from 'express';
import CartManageer from '../CartManager.js';
import __dirname from '../utils.js';

const router = Router();

//Creamos instancia del CartManager para poder usarla en los endpoints
const cartManager = new CartManageer(__dirname + '/carrito.json');

//Endpoint para obtener carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await cartManager.getCartById(cid);

        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

//Endpoint para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const cart = req.body;
        await cartManager.addCart(cart);

        res.status(201).json({ message: 'Carrito creado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

//Endpoint para agregar productos al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));

        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

export default router;