import cartsMongo from '../dal/daos/cartsDaos/cartsMongo.js';
import productsMongo from '../dal/daos/productsDaos/productsMongo.js';
import ordersMongo from '../dal/daos/ordersDaos/ordersMongo.js';
import usersMongo from '../dal/daos/usersDaos/usersMongo.js';
import { verifyToken } from '../utils/jwt.utils.js'

class CartsService {
    async findAll() {
        try {
            const result = await cartsMongo.findAll();
            return result;
        } catch (error) {
            return error;
        }
    }

    async findById(id) {
        try {
            const result = await cartsMongo.findById(id);
            return result;
        } catch (error) {
            return error;
        }
    }

    async create(tokenUserId) {
        try {
            const { id } = verifyToken(tokenUserId);
            const user = await usersMongo.findById(id);
            if (!user) {
                return { error: 'User not found' }
            }
            const cart = await cartsMongo.create();
            const userCart = await usersMongo.update(id, { cart: cart._id });
            return { cart, userCart };
        } catch (error) {
            return error;
        }
    }

    async update(id, carts) {
        try {
            const result = await cartsMongo.update(id, carts);
            return result;
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            const result = await cartsMongo.delete(id);
            return result;
        } catch (error) {
            return error;
        }
    }

    async deleteSoft(id) {
        try {
            const result = await cartsMongo.deleteSoft(id);
            return result;
        } catch (error) {
            return error;
        }
    }

    async addProduct(cid, pid) {
        try {
            const cart = await cartsMongo.findById(cid);
            const pro = await productsMongo.findById(pid);
            if (!cart) {
                return { error: 'Cart not found' }
            }
            if (!pro) {
                return { error: 'Product not found' }
            }

            //Si el prod existe, se suma a la cantidad existente en el cart; si no, se agrega el primer prod
            const product = cart.products.find(p => p.pid._id.toString() === pid);
            if (product) {
                product.quantity++;
            } else {
                cart.products.push({ pid: pid, quantity: 1 });
            }
            const result = await cartsMongo.update(cid, cart);
            return result;
        } catch (error) {
            return error;
        }
    }

    async removeProduct(cid, pid) {
        try {
            const cart = await cartsMongo.findById(cid);
            if (!cart) {
                return { error: 'Cart not found' };
            }
            const pro = await productsMongo.findById(pid);
            if (!pro) {
                return { error: 'Product not found' };
            }
            const product = cart.products.find(p => p.pid._id.toString() === pid);
            if (product) {
                if (product.quantity > 1) {
                    product.quantity--;
                } else {
                    cart.products = cart.products.filter(p => p.pid._id.toString() !== pid);
                }
            } else {
                return { error: 'Product not found in cart' };
            }
            const result = await cartsMongo.update(cid, cart);
            return result;
        } catch (error) {
            return error;
        }
    }

    async removeAllProducts(cid) {
        try {
            const cart = await cartsMongo.findById(cid);
            if (!cart) {
                return { error: 'Cart not found' };
            }
            cart.products = [];
            const result = await cartsMongo.update(cid, cart);
            return result;
        } catch (error) {
            return error;
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await cartsMongo.findById(cid);
            if (!cart) {
                return { error: 'Cart not found' };
            }
            const pro = await productsMongo.findById(pid);
            if (!pro) {
                return { error: 'Product not found' };
            }
            const product = cart.products.find(p => p.pid._id.toString() === pid);
            if (product) {
                product.quantity = quantity;
            } else {
                return { error: 'Product not found in cart' };
            }
            const result = await cartsMongo.update(cid, cart);
            return result;
        } catch (error) {
            return error;
        }
    }

    async purchase(cid, tokenUserId) {
        try {
            const { id } = verifyToken(tokenUserId);
            const user = await usersMongo.findById(id);
            if (!user) {
                return { error: 'User not found' }
            }
            const cart = await cartsMongo.findById(cid);
            if (!cart) {
                return { error: 'Cart not found' }
            }
            const products = [];
            const productsNotPurchased = [];
            let amount = 0;

            for (const product of cart.products) {
                const pro = await productsMongo.findById(product.pid._id);
                if (!pro) {
                    return { error: 'Product not found' };
                }
                if (pro.stock >= product.quantity) {
                    pro.stock -= product.quantity;
                    amount += pro.price * product.quantity;
                    products.push({ pid: product.pid._id, quantity: product.quantity });
                    await productsMongo.update(product.pid._id, pro);
                } else {
                    productsNotPurchased.push(product.pid._id);
                }
            }

            const order = {
                order_number: Math.floor(Math.random() * 1000000).toString(),
                purchase_date: new Date(),
                amount: amount,
            }

            const result = await ordersMongo.create(order);
            if (productsNotPurchased.length > 0) {
                cart.products = cart.products.filter(p => !productsNotPurchased.includes(p.pid._id.toString()));
            } else {
                cart.products = [];
            }
            await cartsMongo.update(cid, cart);
            return result;
        } catch (error) {
            return error;
        }
    }
}

const cartsService = new cartsService();

export default cartsService;