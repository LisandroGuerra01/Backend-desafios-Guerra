import { productsModel } from "../../db/models/products.model.js";

export default class ProductManager {

    async getProducts(limit, page, query, sort) {
        try {
            const searh = query ? {
                stock: { $gt: 0 },
                $or: [
                    //Devuelve los prod que tengan el query en el titulo o en la categoría
                    { title: { $regex: query, $options: "i" } },
                    { category: { $regex: query, $options: "i" } },
                ]
            } : {
                //Devuelve los prod que tengan stock mayor a 0
                stock: { $gt: 0 }
            };
            if (sort == 'asc') {
                sort = { price: 1 };
            } else if (sort == 'desc') {
                sort = { price: -1 };
            }

            const options = {
                page: page || 1,
                limit: limit || 10,
                sort: sort,
                lean: true
            }

            const allProducts = await productsModel.paginate(searh, options);
            return allProducts;
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
            const updatedProduct = await productsModel.findByIdAndUpdate(id, update, { new: true });
            return updatedProduct;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id) {
        try {
            const product = await productsModel.findByIdAndDelete(id);
            return product;
        } catch (error) {
            console.log(error);
        }
    }
}