import cartsSevice from '../services/carts.service.js'

class CartsController {
    async findAllCarts(req, res) {
        try {
            const result = await cartsSevice.findAll()
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error)
        }
    }

    async findCartsById(req, res) {
        try {
            const result = await cartsSevice.findById(req.params.id)
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error)
        }
    }

    async createCarts(req, res) {
        try {
            //Obtengo id del usuariod e la cookie token y lo envío para crear el cart
            const tokenUser = req.cookies.token;
            const result = await cartsSevice.create(tokenUser)
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error)
        }
    }

    async deleteCarts(req, res) {
        try {
            const result = await cartsSevice.delete(req.params.id)
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error)
        }
    }

    async deleteSoftCarts(req, res) {
        try {
            const result = await cartsSevice.deleteSoft(req.params.id)
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error)
        }
    }

    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const result = await cartsSevice.addProduct(cid, pid)
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error)
        }
    }

    async removeProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const result = await cartsSevice.removeProduct(cid, pid)
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error)
        }
    }

    removeAllProductsFromCart(req, res) {
        try {
            const { cid } = req.params;
            const result = cartsSevice.removeAllProducts(cid)
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error)
        }
    }

    async updateProductQuantityFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const result = await cartsSevice.updateProductQuantity(cid, pid, quantity)
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error)
        }
    }

    async purchaseCart(req, res) {
        try {
            const { cid } = req.params;
            const tokenUser = req.cookies.token;
            const result = await cartsSevice.purchase(cid, tokenUser)
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error)
        }
    }
}

const cartsController = new CartsController();

export default cartsController;