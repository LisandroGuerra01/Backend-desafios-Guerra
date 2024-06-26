import jwt from 'jsonwebtoken';

const secret = 'Secretkey';

//Middleware para verificar si el usuario está autenticado
export const auth = async (req, res, next) => {
    try {
        if (req.session.passport?.user) {
            next();
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//Middleware para verificar si el usuario está logueado
export const isLogged = async (req, res, next) => {
    try {
        if (req.session.passport?.user) {
            res.redirect('/profile');
        } else {
            next();
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//Middleware para verificar si el usuario esta logueado usando JWT
export const jwtAuth = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        const token = authHeader?.split(' ')[1];
        const decoded = jwt.verify(token, secret);
        if (!decoded) {
            res.status(401).json({ error: "Invalid token" });
        }
        req.user = decoded;
        console.log("DECODED:", decoded);
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//Middleware para verificar si el usuario está logueado usando JWT y cookies
export const jwtAuthCookie = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, secret);
        if (!decoded) {
            res.status(401).json({ error: "Invalid token" });
        }
        req.user = decoded;
        console.log("DECODED:", decoded);
        console.log("REQ.USER:", req.user);
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}