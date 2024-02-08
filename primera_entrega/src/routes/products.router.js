import { Router } from "express";
import ProductManager from "../productManager.js"

const router = Router();

//Creo una instancia de la clase ProductManager para usarla en los endpoints
const productManager = new ProductManager("./products.json");

//Endpoint para obtener los productos
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if (limit) {
            const limitedProducts = products.slice(0, limit);
            res.status(200).send({ status: "success", payload: limitedProducts });
        } else {
            res.status(200).send({ status: "success", payload: products });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al obtener los productos" });
    }
});

//Endpoint para obtener un producto por su ID
router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(parseInt(pid));

        if (product) {
            res.status(200).send({ status: "success", payload: product });
        } else {
            res.status(404).send({ status: "error", error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al obtener el producto" });
    }
});

//Endpoint para agregar un producto
router.post("/", async (req, res) => {
    try {
        const product = req.body;
        if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
            return res.status(400).send({ status: "error", error: "Faltan datos del producto" });
        }

        const newProduct = await productManager.addProduct(product);
        if (newProduct === -1) {
            return res.status(400).send({ status: "error", error: "El producto ya existe" });
        }

        res.status(201).send({ status: "success", payload: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al agregar el producto" });
    }
})

// Endpoint para actualizar un producto
router.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = req.body;

        const updatedProduct = await productManager.updateProduct(parseInt(pid), product);
        if (updatedProduct === -1) {
            return res.status(404).send({ status: "error", error: "Producto no encontrado" });
        }

        res.status(201).send({ status: "success", payload: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al actualizar el producto" });
    }
});

// Endpoint para borrar un producto
router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productManager.deleteProduct(parseInt(pid));
        if (deletedProduct === -1) {
            return res.status(404).send({ status: "error", error: "Producto no encontrado" });
        }

        res.status(201).send({ status: "success", payload: deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error al borrar el producto" });
    }
});

export default router;