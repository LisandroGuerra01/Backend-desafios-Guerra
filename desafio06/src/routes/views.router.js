import { Router } from "express";
import ProductManager from "../Dao/ManagerMongo/ProductManagerMongo.js";
import CartsManager from "../Dao/ManagerMongo/CartManagerMongo.js";
import UsersManager from "../Dao/ManagerMongo/UsersManagerMongo.js";
import { auth, isLogged } from "../middlewares/auth.middleware.js";

const router = Router();
const usersManager = new UsersManager();

router.get("/chat", async (req, res) => {
    res.render("chat", {
        title: "Chat",
        StyleSheet: "chat.css",
    });
});

//Endpoint para visualizar todos los productos
router.get("/products", auth, async (req, res) => {

    const { first_name, last_name, email, age, role } = req.user;

    const productManager = new ProductManager();
    const products = await productManager.getProducts(2);

    res.render("products", {
        products,
        first_name,
        last_name,
        email,
        age,
        role,
    });
});

//Endpoint para visualizar todos los productos con paginación
router.get("/products/page/:page", auth, async (req, res) => {
    const productManager = new ProductManager();
    const products = await productManager.getProducts(2, page);

    res.render("products", { products });
});

//Endpoint para visualizar un producto en particular
router.get("/products/:pid", auth, async (req, res) => {
    const productManager = new ProductManager();
    const product = await productManager.getProductById(req.params.pid);

    const { _id, title, description, price, code, stock, category, thumbnail } = product;

    res.render("product", { id: _id, title, description, price, code, stock, category, thumbnail });
});

//Endpoint para visualizar el carrito de compras
router.get("/carts/:cid", auth, async (req, res) => {
    const cartManager = new CartsManager();
    const cart = await cartManager.getCartById(req.params.cid);

    const { products } = cart;

    res.render("cart", { products });
});

//Endpoint para registro de usuario
router.get("/register", isLogged, (req, res) => {
    res.render("register");
});

//Endpoint para login de usuario
router.get("/login", isLogged, (req, res) => {
    res.render("login");
});

//Endpoint para perfil de usuario
router.get("/profile", auth, async (req, res) => {
    const { first_name, last_name, email, age, role } = req.user;
    res.render("profile", { first_name, last_name, email, age, role });
});

//Endpoint para error de registro
router.get("/errorRegister", (req, res) => {
    res.render("errorRegister");
});

//Endpoint para error de login
router.get("/errorLogin", (req, res) => {
    res.render("errorLogin");
});

export default router;