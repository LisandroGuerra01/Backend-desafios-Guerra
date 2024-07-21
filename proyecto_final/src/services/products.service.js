import productsMongo from '../dal/daos/productsDaos/productsMongo.js';
import productsMocks from '../utils/mocks.utils.js';
import { verifyToken } from '../utils/jwt.utils.js';
import emailService from '../utils/emailService.utils.js';

class ProductsService {
    async findAll(limit, page, sort, query) {
        try {
            const search = query ? {
                stock: { $gt: 0 },
                $or: [
                    //devuelve todos los productos que tengan el query en el titulo o en la categoria
                    { category: { $regex: query, $options: 'i' } },
                    { title: { $regex: query, $options: 'i' } },
                ]
            } : {
                //devuelve todos los productos que tengan stock mayor a 0
                stock: { $gt: 0 }
            }
    
            if (sort === 'asc') {
                sort = { price: 1 };
            } else if (sort === 'desc') {
                sort = { price: -1 };
            }
    
            const options = {
                page: page || 1,
                limit: limit || 10,
                sort: sort,
                lean: true,
            }
    
            const allProducts = await productsMongo.findAllPaginate(search, options);
    
            allProducts.docs = allProducts.docs.map(product => {
                const { _id, name, description, price, code, stock, category, thumbnail } = product;
                return { id: _id, name, description, price, code, stock, category, thumbnail };
            });
    
            const info = {
                totalPages: allProducts.totalPages,
                prevPage: allProducts.prevPage,
                nextPage: allProducts.nextPage,
                page: allProducts.page,
                hasPrevPage: allProducts.hasPrevPage,
                hasNextPage: allProducts.hasNextPage,
                prevLink: allProducts.hasPrevPage ? `http://localhost:9090/api/products?page=${allProducts.prevPage}` : null,
                nextLink: allProducts.hasNextPage ? `http://localhost:9090/api/products?page=${allProducts.nextPage}` : null,
            }
    
            return { products: allProducts.docs, info };
        } catch (error) {
            return error;
        }
    }

    async findById(id) {
        try {
            const result = await productsMongo.findById(id);
            if (!result) return ("Producto no encontrado");
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

    async delete(req) {
        try {
            const { params: { id }, user: { role, email } } = req;
            const result = await productsMongo.delete(id);

            if (!result) return ("Producto no encontrado");
            if (role !== 'premium') return result;
            
            const emailText = `El producto ${result.name}, con ${id} ha sido eliminado de la base de datos.`;
            await emailService.sendEmail(email, 'Producto eliminado de la base de datos', emailText)
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