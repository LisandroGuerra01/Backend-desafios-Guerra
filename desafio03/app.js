import express from "express";
import ProductManager from "./productManager.js";
// import { Router } from "express";

const productManager = new ProductManager('./product.json');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/products', async (req, res) => {
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
        console.log(error);
        res.status(500).send({ error: 'Internal server error' });
    }
})

app.get('/api/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);

        if (!product) {
            res.status(404).send({ error: 'Product not found' });
        }
        res.json(product);

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal server error' });
    }
})

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    })