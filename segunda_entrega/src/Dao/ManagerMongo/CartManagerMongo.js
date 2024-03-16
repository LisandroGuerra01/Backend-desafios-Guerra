import { cartsModel } from "../../db/models/carts.model";
import { productsModel } from "../../db/models/products.model";

export default class CartsManager {

    async addCart() {
        try {
            const newCart = new cartsModel();
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log(error);
        }
    }

    async getCartById(id) {
        try {
            const cart = await cartsModel.findById(id).populate("products.pid");
            return cart;

        } catch (error) {
            console.log(error);
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const cart = await cartsModel.findById(cid);
            const prod = await productsModel.findById(pid);
            if (!cart || !prod) {
                return null;
            }

            const product = cart.products.find(p => p.pid.toString() === pid);
            if (!product) {
                console.log("first");
                cart.products.push({ pid: productId, quantity: 1 });
                await cart.save();
            } else {
                console.log("second");
                product.quantity++;
                await cart.updateOne({ products: cart.products })
            }

            return cart;

        } catch (error) {
            console.log(error);
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const cart = await cartsModel.findById(cid);
            if (!cart) {
                return null;
            }

            const product = cart.products.find(p => p.pid.toString() === pid);
            if (!product) {
                return null;
            }

            if (product.quantity > 1) {
                product.quantity--;
                await cart.updateOne({ products: cart.products });
            } else {
                cart.products = cart.products.filter(p => p.pid.toString() !== pid);
                await cart.updateOne({ products: cart.products });
            }

            return cart;

        } catch (error) {
            console.log(error);
        }
    }

    async deleteAllProductsFromCart(cid) {
        try {
            const cart = await cartsModel.findById(cid);
            if (!cart) {
                return null;
            }

            cart.products = [];
            await cart.updateOne({ products: cart.products });

            return cart;

        } catch (error) {
            console.log(error);
        }
    }

    async updateAllProductsFromCart(cid, products) {
        try {
            const cart = await cartsModel.findById(cid);
            if (!cart) {
                return null;
            }

            //Verificar si el producto existe en la base de datos
            for (const product of products) {
                const prod = await productsModel.findById(product.pid);
                if (!prod) {
                    return null;
                }
            }

            cart.products = products;
            await cart.updateOne({ products: cart.products });

            return cart;

        } catch (error) {
            console.log(error);
        }
    }

    async updateProductQuantityFromCart(cid, pid, quantity) {
        try {
            const cart = await cartsModel.findById(cid);
            if (!cart) {
                return null;
            }

            const product = cart.products.find(p => p.pid.toString() === pid);
            if (!product) {
                return null;
            }

            product.quantity = quantity;
            await cart.updateOne({ products: cart.products });

            return cart;

        } catch (error) {
            console.log(error);
        }
    }
}