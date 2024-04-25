import { Router } from "express";
import ProductManager from "../dal/dao/ManagerMongo/ProductManagerMongo.js";
import CartManager from "../dal/dao/ManagerMongo/CartManagerMongo.js";
import { auth, isLogged, jwtAuth, jwtAuthCookie } from "../middlewares/auth.middleware.js";

const router = Router();

//Endpoint para chat
router.get('/chat', (req, res) => {
    res.render("chat", {
        title: "Chat",
        StyleSheet: "chat.css"
    })
})

//Endpoint para ver todos los productos si se está logueado
router.get('/products', jwtAuthCookie, async (req, res) => {
    const { first_name, last_name, email, age, role } = req.user;
    const productManager = new ProductManager();
    const products = await productManager.getProducts();
    res.render("products", {
        products,
        first_name,
        last_name,
        email,
        age,
        role,
    })
})

//Endpoint para ver todos los productos con paginación
router.get('/products/:page', jwtAuthCookie, async (req, res) => {
    const productManager = new ProductManager();
    const products = await productManager.getProductById(req.params.id);
    const { _id, title, description, price, code, stock, category, thumbnail } = product;
    res.render("product", {
        id: _id,
        title,
        description,
        price,
        code,
        stock,
        category,
        thumfbnail
    })
})

//Endpoint para visualizar el carrito de compras
router.get('/carts/:cid', async (req, res) => {
    const cartManager = new CartManager();
    const cart = await cartManager.getCartById(req.params.cid);
    const { products } = cart;
    res.render("cart", {
        products
    })
})

//Endpoint para register de usuario
router.get('/register', isLogged, (req, res) => {
    res.render("register")
})
//Endpoint para login de usuario
router.get('/login', isLogged, (req, res) => {
    res.render("login")
})

//Endpoint para ver el perfil de usuario
router.get("/profile", jwtAuthCookie, async (req, res) => {
    const { first_name, last_name, email, age, role } = req.user;
    res.render("profile", { first_name, last_name, email, age, role });
});

// Endpoint de error de registro
router.get("/errorRegister", (req, res) => {
    res.render("errorRegister");
});

//Endpoint de error de login
router.get("/errorLogin", (req, res) => {
    res.render("errorLogin");
});

export default router;