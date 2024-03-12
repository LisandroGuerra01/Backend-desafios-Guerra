// const fs = require('fs');
import fs from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    //Función para añadir producto
    async addProduct(product) {
        const products = await this.getProducts();
        
        // Verificar si el producto ya existe por su código
        const existingProduct = products.find(p => p.code === product.code);
        if (existingProduct) {
            console.log(`El producto con código ${product.code} ya existe. No se puede agregar nuevamente.`);
            return existingProduct;
        }

        const lastProduct = products[products.length - 1];
        const newId = lastProduct ? lastProduct.id + 1 : 1;
        const newProduct = { ...product, id: newId };
        products.push(newProduct);
        await this.#saveProducts(products);
        return newProduct;
    }

    //Función para obtener productos
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

    //Función para buscar productos por ID
    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(product => product.id === +id);
        if (!product) {
            return null;
        }
        return product;
    }

    //Función para actualizar producto
    async updateProduct(id, update) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index === -1) {
            return null;
        }
        const updatedProduct = { ...products[index], ...update, id };
        products.splice(index, 1, updatedProduct);
        await this.#saveProducts(products);
        return updatedProduct;
    }

    //Función para eliminar producto
    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index === -1) {
            return null;
        }
        products.splice(index, 1);
        await this.#saveProducts(products);
        return id;
    }

    async #saveProducts(products) {
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }
}

//Path: product.json e instanciar el objeto
// const productManager = new ProductManager('./product.json');

//Función para probar el CRUD
async function testCRUD() {

    //Consultar todos los productos
    console.log('Todos los productos: \n', await productManager.getProducts());

    //Añadir producto
    const product1 = await productManager.addProduct({
        title: 'Producto 1',
        description: 'Descripción del producto 1',
        price: 100,
        thumbnail: 'XXXXXXXXXXXXXXXXXXXXXX',
        code: 'abc123',
        stock: 10,
    });

    const product2 = await productManager.addProduct({
        title: 'Producto 2',
        description: 'Descripción del producto 2',
        price: 200,
        thumbnail: 'XXXXXXXXXXXXXXXXXXXXXX',
        code: 'abcd123',
        stock: 20,
    })

    //Consultar todos los productos
    console.log('Todos los productos: \n', await productManager.getProducts());


    //Obtener producto por ID
    const productById = await productManager.getProductById(1);
    if (!productById) {
        console.log('Producto no encontrado');
    } else {
        console.log('Producto por ID \n', productById);
    }

    //Actualizar un producto
    const updatedProduct = {
        title: 'Producto actualizado',
        description: 'Descripción del producto actualizado',
        price: 300,
    }
    const productUpdated = await productManager.updateProduct(1, updatedProduct);
    if (!productUpdated) {
        console.log('Producto no encontrado con ese ID');
    } else {
        console.log('Producto actualizado \n', productUpdated);
    }

    //Eliminar un producto
    const deletedProductId = await productManager.deleteProduct(11);
    if (!deletedProductId) {
        console.log('Producto no encontrado con ese ID');
    } else {
        console.log('Producto eliminado con ID: ', deletedProductId);
    }

    //Consultar todos los productos después de eliminar uno
    console.log('Productos restantes: \n', await productManager.getProducts());
}

//Ejecuto la función
// testCRUD();

export default ProductManager;