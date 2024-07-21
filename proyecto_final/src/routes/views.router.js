import { Router } from "express";
import userService from "../services/users.service.js"
// import productsService from "../services/products.service.js";
import cartsService from "../services/carts.service.js";
import { verifyTokenAdmin, isLogged } from "../middlewares/auth.middleware.js";

const router = Router();

//Endpoint para chat
router.get('/chat', (req, res) => {
    res.render("chat", {
        title: "Chat",
        StyleSheet: "chat.css"
    })
})

//Endpoint para login de usuario
router.get('/login', (req, res) => {
    res.render("login")
})

//Endpoint para ver el perfil de usuario
router.get("/profile", async (req, res) => {
    res.render("profile");
});

//Endpoint para modificar roles de usuarios y eliminar usuarios, solo accesible para admin
router.get('/modify', verifyTokenAdmin, async (req, res) => {
    const users = await userService.findAllConId()
    res.render("modify", {
        users
    });
});

//Endpoint para visualizar el carrito de compras
router.get('/carts/:id', async (req, res) => {
    const cart = await cartsService.findById(req.params.id);
    const { products } = cart;
    console.log(products);
    res.render("cart", {
        products
    })
})

//Endpoint para ver mensaje de compra exitosa
router.get('/purchase', (req, res) => {
    res.render("purchase")
})

//Endpoint para ver todos los productos si se está logueado
// router.get('/products', jwtAuthCookie, async (req, res) => {
//     const { first_name, last_name, email, age, role } = req.user;
//     const productManager = new ProductManager();
//     const products = await productManager.getProducts();
//     res.render("products", {
//         products,
//         first_name,
//         last_name,
//         email,
//         age,
//         role,
//     })
// })

//Endpoint para ver todos los productos con paginación
// router.get('/products/page/:page', isLogged, async (req, res) => {
//     const products = await productsService.findAll(2, page);

//     res.render("products", { products });
// });

//Endpoint para register de usuario
router.get('/register', (req, res) => {
    res.render("users")
})


// Endpoint de error de registro
// router.get("/errorRegister", (req, res) => {
//     res.render("errorRegister");
// });

//Endpoint de error de login
// router.get("/errorLogin", (req, res) => {
//     res.render("errorLogin");
// });



export default router;