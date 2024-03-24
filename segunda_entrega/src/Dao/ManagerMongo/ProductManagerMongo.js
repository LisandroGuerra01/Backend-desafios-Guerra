import { productsModel } from "../../db/models/products.model.js";

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
            const newProduct = new productsModel(product);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(id, update) {
        try {
            const updatedProduct = await productsModel.findOneAndUpdate(id, update, { new: true });
            return updatedProduct;
        } catch (error) {
            console.log(error);
        }
    }

    async getProductById(id) {
        try {
            const product = await productsModel.findById(id);
            return product;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await productsModel.findByIdAndDelete(id);
            return deletedProduct;
        } catch (error) {
            console.log(error);
        }
    }
}

