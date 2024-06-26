import { Router } from "express";
import UsersManager from "../Dao/ManagerMongo/UsersManagerMongo.js";

const router = Router();
const usersManager = new UsersManager();

router.post('/register', async (req, res) => {
    try {
        const user = req.body;
        const newUser = await usersManager.createUser(req.body);
        if (newUser) {
            res.redirect('/views/login');
        } else {
            res.redirect('/views/errorRegister');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = req.body;
        const userLogged = await usersManager.loginUser(req.body);
        if (userLogged) {
            for (const key in user) {
                req.session[key] = user[key];
            }
            req.session.userId = userLogged._id;
            req.session.logged = true;
            if (userLogged.email === 'adminCoder@coder.com' && userLogged.password === 'adminCod3r123') {
                req.session.isAdmin = true;
            } else {
                req.session.isAdmin = false;
                req.session.role = 'user';
            }
            res.redirect('/views/products');
        } else {
            res.redirect('/views/errorLogin');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/views/login');
        }
    })
});

export default router;