import { Router } from 'express';
import passport from 'passport';
import { jwtAuthCookie } from '../middlewares/auth.middleware';

const router = Router();

//Extraer user con token en cookie
router.get('/user', jwtAuthCookie, passport.authenticate('current', { session: false }), (req, res) => {
    res.send(req.user);
});

export default router;