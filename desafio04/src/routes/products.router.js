import { Router } from "express";
import ProductManager from "../ProductManager.js";
import __dirname from "../utils.js";

const router = Router();

//Creamos una instancia del Product Manager para usar en los endpoints
const productManager = new ProductManager(__dirname + "/products.json");

//Endpoint para obtener todos los productos o los productos filtrados por limit
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;

        const products = await productManager.getProducts();

        if (limit) {
            const limitedProducts = products.slice(0, limit);
            res.json(limitedProducts);
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

//Endpoint para obtener un producto por su ID
router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;

        const product = await productManager.getProductById(parseInt(pid));

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

//Endpoints para agregar un producto
router.post("/", async (req, res) => {
    try {
        const product = req.body;
        if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }
        const newProduct = await productManager.addProduct(product);
        if (newProduct === -1) {
            return res.status(400).json({ error: "El código del producto ya existe" });
        }
        res.status(201).json("Producto agregado");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al agregar el producto" });
    }
});

//Endpoints para actualizar un producto
router.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = req.body;
        const updatedProduct = await productManager.updateProduct(parseInt(pid), product);
        if (updatedProduct === -1) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json("Producto actualizado");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

// endpoint para eliminar un producto
router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productManager.deleteProduct(parseInt(pid));
        if (deletedProduct === -1) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.status(201).json("Producto eliminado");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

export default router;