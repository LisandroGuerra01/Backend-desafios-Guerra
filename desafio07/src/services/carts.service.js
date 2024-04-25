import CartManager from '../dal/dao/ManagerMongo/CartManagerMongo.js'
import ProductManager from "../dal/dao/ManagerMongo/ProductManagerMongo.js";

const cartManager = new CartManager()
const productManager = new ProductManager()

//Exportamos la función para obtener un carrito por id
export const getCart = async (cid) => {
    try {
        const cart = await cartManager.getCartById(cid)
        return cart
    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener el carrito');
    }
}

//Exportamos la función para agregar un carrito vacío
export const addCart = async () => {
    try {
        const cart = await cartManager.addCart()
        return cart;
    } catch (error) {
        console.log(error)
        throw new Error('Error al agregar el carrito');
    }
}

//Exportamos la función para agregar un producto al carrito
export const addProductToCart = async (cid, pid) => {
    try {
        const cart = await cartManager.getCartById(cid)
        const pro = await productManager.getProductById(pid)
        if (!cart || !pro) {
            return null;
        }
        const product = cart.products.find((product) => product.pid._id.toString() === pid);

        if (!product) {
            cart.products.push({ pid: pid, quantity: 1 });
            await cartManager.saveCart(cart);
        } else {
            product.quantity++;
            await cartManager.updateOneCart(cart);
        }
        return cart;
    } catch (error) {
        console.log(error)
        throw new Error('Error al agregar el producto al carrito');
    }
}

//Exportamos la  función para eliminar un producto del carrito
export const deleteProductFromCart = async (cid, pid) => {
    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return null;
        }

        const product = cart.products.find((product) => product.pid._id.toString() === pid);
        if (!product) {
            return null;
        } else {
            product.quantity--;
            if (product.quantity === 0) {
                cart.products = cart.products.filter((product) => product.pid._id.toString() !== pid);
            }
            await cartManager.updateOneCart(cart);
        }
        return cart;
    } catch (error) {
        console.log(error)
        throw new Error('Error al eliminar el producto del carrito');
    }
}

//Exportamos la función para eliminar todos los productos del carrito
export const deleteProductsFromCart = async (cid) => {
    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return null;
        }
        cart.products = [];
        await cartManager.updateOneCart(cart);
        return cart;
    } catch (error) {
        console.log(error)
        throw new Error('Error al eliminar los productos del carrito');
    }
}

//Exportamos la función para actualizar el carrito
export const updateProductsFromCart = async (cid, products) => {
    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return null;
        }
        cart.products = products;
        await cartManager.updateOneCart(cart);
        return cart;
    } catch (error) {
        console.log(error)
        throw new Error('Error al actualizar los productos del carrito');
    }
}

//Exportamos la función para actualizar la cantidad de un producto en el carrito
export const updateProductsQaFromCart = async (cid, pid, quantity) => {
    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return null;
        }

        const product = cart.products.find((product) => product.pid._id.toString() === pid);
        if (!product) {
            return null;
        } else {
            product.quantity = quantity;
            await cartManager.updateOneCart(cart);
        }
        return cart;
    } catch (error) {
        console.log(error)
        throw new Error('Error al actualizar la cantidad de un producto en el carrito');
    }
}