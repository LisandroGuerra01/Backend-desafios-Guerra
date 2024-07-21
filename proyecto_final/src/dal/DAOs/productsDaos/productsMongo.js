import productsModel from '../../mongoDB/models/products.model.js';
import BasicMongo from '../basicMongo.js';

class ProductsMongo extends BasicMongo {
    constructor() {
        super(productsModel);
    }

    async findAllPaginate(search, options) {
        try {
            const result = await this.model.paginate(search, options);
            return result;
        } catch (error) {
            return error;
        }
    }
}

const productsMongo = new ProductsMongo();

export default productsMongo;