import { Router } from "express";
import UsersManager from "../Dao/ManagerMongo/UsersManagerMongo.js";
import passport from "passport";
import { generateToken } from "../jwt/jwt.js";

const router = Router();
const usersManager = new UsersManager();

//Register con passport
router.post('/register', passport.authenticate('Register', {
    successRedirect: '/login',
    failureRedirect: '/errorRegister',
    passReqToCallback: true,
}));

//Login
// router.post('/login', passport.authenticate('Login', { successRedirect: '/profile', failureRedirect: '/errorLogin' }), async (req, res) => {
//     const user = req.user;
//     if (!user) return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
//     req.session.user = {
//         name: `${user.first_name} ${user.last_name}`,
//         email: user.email,
//         age: user.age
//     };
//     req.session.admin = true;
//     res.send({ status: "success", payload: req.session.user })
// });

//Login con JWT sin passport
router.post('/login', async (req, res) => {
    try {
        const user = req.body;
        const userLogged = await usersManager.loginUser(user);
        if (userLogged) {
            const token = generateToken(userLogged);
            res.cookie('token', token, { maxAge: 60000, httpOnly: true });
            res.redirect('/products');
        } else {
            res.redirect('/errorLogin');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Login con JWT con passport
router.get('/loginpass', passport.authenticate('current', { session: false }), (req, res) => {
    res.send(req.user);
});

//Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    req.session.destroy((error) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/login');
        }
    })
});

//Register con passport Github Strategy
router.get('/github', passport.authenticate('Github', { scope: ['user:email'] }));

//Login con passport Github Strategy
router.get('/github/callback', passport.authenticate('Github', { failureRedirect: '/errorRegister' }), (req, res) => {
    req.session.email = req.user.email;
    req.session.logged = true;
    req.session.userId = req.user._id;
    req.session.isAdmin = false;
    req.session.role = 'user';
    res.redirect('/products');
});

export default router;