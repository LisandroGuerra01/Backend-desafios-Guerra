const express = require('express');
const ProductManager = require('../desafio02/desafio02');

const app = express();
const port = 8080;

const productManager = new ProductManager('./desafio02/products.json');

app.get('/products', async (req, res) => {
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

app.get('/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await productManager.getProductById(productId);

        if (!product) {
            res.status(404).send({ error: 'Product not found' });
        } else {
            res.json(product);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});