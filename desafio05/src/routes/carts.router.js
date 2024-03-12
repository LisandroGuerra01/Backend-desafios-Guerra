import { Router } from 'express';
import CartManager from '../Dao/ManagerMongo/CartManagerMongo.js'

const router = Router();
const cartManager = new CartManager('./carrito.json');

//Endpoint para obtener un carrito por su id de la lista de carritos del archivo JSON
router.get('/:id', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);

        if(cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        }
    } catch (error) {
        console. error(error);
        res.status(500).send({ status: "error", error: "Error al obtener el carrito" });
    }
});

//Endpoint para agregar un carrito vacío a la lista de carritos del archivo JSON
router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.addCart();

        res.status(201).send({ status: "success", payload: cart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al crear el carrito" });
    }
});

//Endpoint para agregar un producto (pid) a un carrito (cid) de la lista de carritos del archivo JSON
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.addProductToCart(cid, pid);

        if(cart) {
        res.status(201).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al agregar el producto al carrito" });
    }
});

//Endpoint para eliminar un producto (pid) de un carrito (cid) de la lista de carritos del archivo JSON
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.deleteProductFromCart(cid, pid);

        if(cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al eliminar el producto del carrito" });
    }
});

//Endpoint para eliminar todos los productos de un carrito (cid) de la lista de carritos del archivo JSON
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.deleteAllProductsFromCart(cid);

        if(cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al eliminar los productos del carrito" });
    }
});

//Endpoint para actualizar todos los productos de un carrito (cid) de la lista de carritos del archivo JSON
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const cart = await cartManager.updateAllProductsFromCart(cid, products);

        if(cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al actualizar los productos del carrito" });
    }
});

//Endpoint para actualizar solamente la cantidad de un producto (pid) de un carrito (cid) de la lista de carritos del archivo JSON
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await cartManager.updateProductQuantityFromCart(cid, pid, quantity);

        if(cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al actualizar la cantidad del producto del carrito" });
    }
});

export default router;