import fs from "fs";
import ProductManager from "./productManager.js";

const productManager = new ProductManager('./products.json');

//Creo la clase CartManager para usar sus métodos
class CartManager {
    constructor(path) {
        this.path = path;
    }

    //Método para crear un carrito
    async addCart() {
        const carts = await this.#getCarts();

        const lastCart = carts[carts.length - 1];
        const newIde = lastCart ? lastCart.id + 1 : 1;
        const newCart = {
            id: newIde,
            products: []
        };
        carts.push(newCart);
        await this.#saveCarts(carts);
        return newCart;
    }

    //Método para obtener un carrito por su id
    async getCartById(id) {
        const carts = await this.#getCarts();
        const cart = carts.find(cart => cart.id === id);
        if (!cart) {
            return null;
        }
        return cart;
    }

    //Método para agregar un producto al carrito
    async addProductToCart(cid, pid) {
        const carts = await this.#getCarts();
        const cart = carts.find(cart => cart.id === cid);
        if (!cart) {
            return null;
        }
        const product = await productManager.getProductById(pid);
        if (!product) {
            console.log("wtf?");
            return null;
        }
        //Validar stock
        if (product.stock === 0) {
            return null;
        }
        const existingProduct = cart.products.find(p => p.product === pid);
        if (!existingProduct) {
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            existingProduct.quantity++;
        }
        await productManager.restStock(pid); //Actualizar stock del producto en el archivo product.json
        await this.#saveCarts(carts);
        return cart;
    }

    //Método para obtener la lista de carritos
    async #getCarts() {
        try {
            const carts = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(carts);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.#saveCarts([]);
                return [];
            }
            throw error;
        }
    }

    //Método para guardar la lista de carritos
    async #saveCarts(carts) {
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    }
}

export default CartManager;