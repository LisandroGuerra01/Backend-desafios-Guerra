import { Router } from 'express';
import passport from 'passport';
import {loginUsers} from '../controllers/users.controller.js';

const router = Router();

//Endpoint para registrar un usuario
router.post('/register', passport.authenticate('Register', {
    successRedirect: '/login',
    failureRedirect: '/errorRegister',
    passReqToCallback: true,
}));

//Endpoint para loguear un usuario
router.get('/login', loginUsers);

//Endpoint para extraer usuario de la sesión actual
router.get('/loginpass', passport.authenticate('current', { session: false }), (req, res) => {
    res.send(req.user);
});

//Endpoint para desloguear usuario
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.session.destroy((error) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/login');
        }
    })
});

//Endpoint para logear con github strategy
router.get('/github', passport.authenticate('Github', { scope: ['user:email'] }));

//Endpoint para callback de github strategy
router.get('/github/callback', passport.authenticate('Github', {
    failureRedirect: '/errorRegister',
}), (req, res) => {
    req.session.email = req.user.email;
    req.session.logged = true;
    req.session.userId = req.user._id;
    req.session.isAdmin = false;
    req.session.role = req.user.role;
    res.redirect('/profile');
});

export default router;