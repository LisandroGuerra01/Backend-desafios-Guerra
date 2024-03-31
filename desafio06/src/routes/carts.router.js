import { Router } from "express";
import CartManager from "../Dao/ManagerMongo/CartManagerMongo.js";

const router = Router();
const cartManager = new CartManager('./carrito.json');

//Endpoint para obtener un carrito por su id de la lista de carritos
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);

        if (cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: "Error al obtener el carrito" });
    }
});

//Endpoint para agregar un carrito vacío a la lista de carritos
router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.addCart();
        res.status(201).send({ status: "success", payload: cart });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: "Error al agregar el carrito" });
    }
});

//Endpoint para agregar un producto (pid) a un carrito (cid)
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.addProductToCart(cid, pid);

        if (cart) {
            res.status(201).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: "Error al agregar el producto al carrito" });
    }
});

//Endpoint para eliminar un producto (pid) de un carrito (cid)
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.deleteProductFromCart(cid, pid);

        if (cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: "Error al eliminar el producto del carrito" });
    }
});

//Endpoint para eliminar todos los productos de un carrito (cid) de la base de datos de mongo
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.deleteAllProductsFromCart(cid);

        if (cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: "Error al eliminar los productos del carrito" });
    }
});

//Endpoint para actualizar todos los productos de un carrito (cid) de la base de datos mongo
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const cart = await cartManager.updateAllProductsFromCart(cid, products);

        if (cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: "Error al actualizar los productos del carrito" });
    }
});

//Endpoint para actualizar la cantidad de un producto (pid) de un carrito (cid) de la base de datos mongo
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await cartManager.updateProductQuantityFromCart(cid, pid, quantity);

        if (cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: "Error al actualizar la cantidad del producto del carrito" });
    }
});

export default router;