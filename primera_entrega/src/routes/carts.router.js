import { Router } from 'express';
import CartManager from '../cartManager.js'

const router = Router();

const cartManager = new CartManager('./carrito.json');

//Endpoint para obtener carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const { cid } =req.params;

        const cart = await cartManager.getCartById(parseInt(cid));

        if (cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al obtener el carrito" });
    }
});

//Endpoint para agregar un carrito vacío a la lista de carritos
router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.addCart();

        res.status(201).send({ status: "success", payload: cart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al crear el carrito" });
    }
});

//Endpoint para agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));

        if (cart) {
            res.status(201).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al agregar el producto al carrito" });
    }
});

export default router;