import { Router } from "express";
import passport from "passport";
import { jwtAuthCookie } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/current', jwtAuthCookie, passport.authenticate('current', { session: false }), (req, res) => {
    res.send(req.user);
});

export default router;