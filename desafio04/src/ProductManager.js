import fs from 'fs';

//Creo clase para manejar los productos del JSON
class ProductManager {
    constructor(path) {
        this.path = path;
    }

    //Método para agregar un producto
    async addProduct(product) {
        const products = await this.getProducts();

        // Verificar si el producto ya existe por su código
        const existingProduct = products.find(p => p.code === product.code);
        if (existingProduct) {
            console.log(`El producto con código ${product.code} ya existe. No se puede agregar nuevamente.`);
            return null;
        }

        const lastProduct = products[products.length - 1];
        const newId = lastProduct ? lastProduct.id + 1 : 1;
        const newProduct = {
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail || [],
            code: product.code,
            stock: product.stock,
            category: product.category,
            status: true,
            id: newId
        };
        products.push(newProduct);
        await this.#saveProducts(products);
        return newProduct;
    }

    //Método para obtener todos los productos
    async getProducts() {
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(products);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.#saveProducts([]);
                return [];
            }
            throw err;
        }
    }

    //Método para obtener un producto por su ID
    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(product => product.id === +id);
        if (!product) {
            return null;
        }
        return product;
    }
    //Método para actualizar producto
    async updateProduct(id, update) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index === -1) {
            return index;
        }
        const updatedProduct = {
            title: update.title || products[index].title,
            description: update.description || products[index].description,
            price: update.price || products[index].price,
            thumbnail: update.thumbnail || products[index].thumbnail,
            code: update.code || products[index].code,
            stock: update.stock || products[index].stock,
            category: update.category || products[index].category,
            status: update.status || products[index].status,
            id: id
        };
        products.splice(index, 1, updatedProduct);
        await this.#saveProducts(products);
        return updatedProduct;
    }

    //Método para eliminar producto
    async deleteProduct(id) {
        const products = await this.getProducts();
        const product = products.find(product => product.id === id);
        if (!product) {
            return null;
        }
        products.splice(products.indexOf(product), 1); // Elimina el producto con el mismo ID
        await this.#saveProducts(products);
        return id;
    }

    //Método para restar stock de producto en 1
    async restStock(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        if (!product) {
            return null;
        }
        product.stock--;
        await this.#saveProducts(products);
        return product;
    }

    async #saveProducts(products) {
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }
}

export default ProductManager;