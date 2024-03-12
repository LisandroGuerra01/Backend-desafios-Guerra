import { Router } from "express";
import ProductManager from "../Dao/ManagerMongo/ProductManagerMongo.js";
import CartManager from "../Dao/ManagerMongo/CartManagerMongo.js";
import UsersManager from "../Dao/ManagerMongo/UsersManagerMongo.js";
import { auth, isLogged } from "../middlewares/auth.middleware.js";

const router = Router();
const usersManager = new UsersManager();

router.get("/chat", (req, res) => {
    res.render("chat", {
        title: "Chat",
        style: "chat.css",
    });
});

//Endpoint para visualizar todos los productos
router.get("/products", auth, async (req, res) => {
    const { userId, isAdmin, role } = req.session;
    const userLogged = await usersManager.getUserById(userId);
    const { first_name, last_name, email, age } = userLogged;

    const productManager = new ProductManager();
    const products = await productManager.getProducts(2);

    res.render("products", {
        products,
        first_name,
        last_name,
        email,
        age,
        isAdmin,
        role,
    });
});

//Endpoint para visualizar todos los productos con paginación
router.get("/products/page/:page", auth, async (req, res) => {
    const page = req.params.page || 1;

    const productManager = new ProductManager();
    const products = await productManager.getProducts(2, page);

    res.render("products", { products });
});

//Endpoint para visualizar un producto en particular
router.get("/products/page/:pid", auth, async (req, res) => {
    const page = req.params.page || 1;

    const productManager = new ProductManager();
    const product = await productManager.getProductById(req.params.id);

    const { _id, title, description, price, code, stock, category, thumbnail } = product;

    res.render("product", {
        id: _id,
        title,
        description,
        price,
        code,
        stock,
        category,
        thumbnail,
    });
});

//Endpoint para visualizar el carrito de compras
router.get("/carts/:cid", async (req, res) => {
    const cartManager = new CartManager();
    const cart = await cartManager.getCartById(req.params.cid);

    const { products } = cart;

    res.render("cart", { products });
});

//Endpoint registro de usuario
router.get("/register", isLogged, (req, res) => {
    res.render("register");
});

//Endpoint login de usuario
router.get("/login", isLogged, (req, res) => {
    res.render("login");
});

//Endpoint perfil de usuario
router.get("/profile", async (req, res) => {
    const { userId, isAdmin, role } = req.session;
    const userLogged = await usersManager.getUserById(userId);
    const { first_name, last_name, email, age } = userLogged;
    res.render("profile", { first_name, last_name, email, age, isAdmin, role });
});

// Ruta Error de registro
router.get("/errorRegister", (req, res) => {
    res.render("errorRegister");
});

// Ruta Error de login
router.get("/errorLogin", (req, res) => {
    res.render("errorLogin");
});

export default router;
