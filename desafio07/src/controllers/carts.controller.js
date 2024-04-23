import {
    getCart,
    addCart,
    addProductToCart,
    deleteProductFromCart,
    deleteProductsFromCart,
    updateProductsFromCart,
    updateProductsQaFromCart
} from "../services/carts.service.js";

//Busca un carrito por id
export const findOneCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await getCart(cid);
        if (cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: "Error al obtener el carrito" });
    }
}

//Crea un carrito
export const createCart = async (req, res) => {
    try {
        const cart = await addCart();
        res.status(201).send({ status: "success", payload: cart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al crear el carrito" });
    }
}

//Agrega un producto a un carrito
export const addOneProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await addProductToCart(cid, pid);
        if (cart) {
            res.status(201).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al agregar el producto al carrito" });
    }
}

//Elimina un producto de un carrito y devuelve el carrito
export const deleteOneProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await deleteProductFromCart(cid, pid);
        if (cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al eliminar el producto del carrito" });
    }
}

//Elimina todos los productos de un carrito y devuelve el carrito
export const deleteAllProductsFromCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await deleteProductsFromCart(cid);
        if (cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al eliminar los productos del carrito" });
    }
}

//Actualiza todos los productos de un carrito y devuelve el carrito
export const updateAllProductsFromCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const products = req.body;
        const cart = await updateProductsFromCart(cid, products);
        if (cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al actualizar los productos del carrito" });
    }
}

//Actualiza la cantidad de productos de un carrito y devuelve el carrito
export const updateAllProductsQaFromCart = async (req, res) => {
    try {
        const { cid,pid } = req.params;
        const { quantity } = req.body;
        const cart = await updateProductsQaFromCart(cid, pid, quantity);
        if (cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al actualizar la cantidad de productos del carrito" });
    }
}