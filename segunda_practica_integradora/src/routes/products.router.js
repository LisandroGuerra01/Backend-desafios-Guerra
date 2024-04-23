import { Router } from "express";
import ProductManager from "../Dao/ManagerMongo/ProductManagerMongo.js";

const router = Router();
const productManager = new ProductManager('./productos.json');

//Endpoint para obtener todos los productos (o N productos si se pasa parámetro limit)
router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;
        const products = await productManager.getProducts(limit, page, sort, query);
        products.docs = products.docs.map(product => {
            const { _id, title, description, price, code, stock, category, thumbnail } = product;
            return { id: _id, title, description, price, code, stock, category, thumbnail };
        });

        const info = {
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}` : null
        }

        res.status(200).send({ status: "success", payload: products.docs, info });

    } catch (error) {
        console.error(error)
        res.status(500).send({ status: "error", error: "Error al obtener los productos" });;
    }
});

//Endpoint para obtener un producto por id (pid) pasado como parámetro en la URL (params)
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);

        if (product) {
            res.status(200).send({ status: "success", payload: product });
        } else {
            res.status(404).send({ status: "error", error: "Producto no encontrado" });;
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ status: "error", error: "Error al obtener el producto" });
    }
});

//Endpoint para agregar un producto
router.post('/', async (req, res) => {
    try {
        const product = req.body;
        if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
            res.status(400).send({ status: "error", error: "Todos los campos son obligatorios" });
            return;
        }
        const newProduct = await productManager.addProduct(product);
        if (!newProduct) {
            res.status(400).send({ status: "error", error: "El producto ya existe" });
        } else {
            res.status(201).send({ status: "success", payload: newProduct });;
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ status: "error", error: "Error al agregar el producto" });
    }
});

//Endpoint para actualizar un producto
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = req.body;
        const updatedProduct = await productManager.updateProduct({ _id: pid }, product);
        if (!updatedProduct) {
            res.status(404).send({ status: "error", error: "Producto no encontrado" });
        } else {
            res.status(200).send({ status: "success", payload: updatedProduct });
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ status: "error", error: "Error al actualizar el producto" });
    }
});

//Endpoint para borrar un producto pasando el id del prod como parámetro en la URL
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productManager.deleteProduct(pid);
        if (!deletedProduct) {
            res.status(404).send({ status: "error", error: "Producto no encontrado" });
        } else {
            res.status(200).send({ status: "success", payload: deletedProduct });
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ status: "error", error: "Error al borrar el producto" });
    }
});

export default router;