import { Router } from "express";
import ProductManager from "../ProductManager.js";
import __dirname from "../utils.js";

const router = Router();
const productManager = new ProductManager(__dirname + "/products.json");

//Endpoint para el formulario de carga de productos
router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products });
})

//Endpoint para el form de carga de productos
router.post("/realTimeProducts", async (req, res) => {
    const product = await productManager.getProducts();
    res.render("realTimeProducts", { product });
});

export default router;