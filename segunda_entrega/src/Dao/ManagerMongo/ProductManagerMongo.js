import { productModel } from "../../db/models/products.model.js";

export default class ProductManager {
    async getProducts(limit, page, query, sort) {
        try {
            const search = query ? {
                stock: { $gt: 0 },
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { category: { $regex: query, $options: "i" } },
                ]
            } : { stock: { $gt: 0 } };

            if (sort === 'asc') {
                sort = { price: 1 };
            } else if (sort === 'desc') {
                sort = { price: -1 };
            }

            const options = {
                page: page || 1,
                limit: limit || 10,
                sort: sort,
                lean: true
            }

            const allProducts = await productsModel.paginate(search, options);
            return allProducts;

        } catch (error) {
            console.log(error);
        }
    }

    async addProduct(product) {
        try {
            const newProduct = new productModel(product);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(id, product) {
        try {
            const updatedProduct = await productModel.findOneAndUpdate(id, update, { new: true });
            return updatedProduct;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(id);
            return deletedProduct;
        } catch (error) {
            console.log(error);
        }
    }
}

