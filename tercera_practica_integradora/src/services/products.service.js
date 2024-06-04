import productsMongo from '../dal/daos/productsDaos/productsMongo.js';
import productsMocks from '../utils/mocks.utils.js';
import { verifyToken } from '../utils/jwt.utils.js';

class ProductsService {
    async findAll() {
        try {
            const result = await productsMongo.findAll();
            return result;
        } catch (error) {
            return error;
        }
    }

    async findById(id) {
        try {
            const result = await productsMongo.findById(id);
            return result;
        } catch (error) {
            return error;
        }
    }

    async create(products, token) {
        try {
            const resultToken = verifyToken(token);
            const { email } = resultToken;
            const result = await productsMongo.create({ ...products, owner: email });
            return result;
        } catch (error) {
            return error;
        }
    }

    async update(id, products, token) {
        try {
            const resultToken = verifyToken(token);
            const { role, email } = resultToken;
            const resultProduct = await productsMongo.findById(id);
            const { owner } = resultProduct;
            if (role === 'admin' || email === owner) {
                const result = await productsMongo.update(id, products);
                return result;
            }
            return 'No tienes permiso para actualizar este producto';
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            const result = await productsMongo.delete(id);
            return result;
        } catch (error) {
            return error;
        }
    }

    async deleteSoft(id) {
        try {
            const result = await productsMongo.deleteSoft(id);
            return result;
        } catch (error) {
            return error;
        }
    }

    async findAllMocks() {
        try {
            const result = productsMocks;
            return result;
        } catch (error) {
            return error;
        }
    }
}

const productsService = new ProductsService();

export default productsService;