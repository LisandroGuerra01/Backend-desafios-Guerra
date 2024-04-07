import jwt from 'jsonwebtoken';

const secret = 'Secretkey';

export const auth = async (req, res, next) => {
    try {
        if (req.session.passport) {
            next();
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const isLogged = async (req, res, next) => {
    try {
        if (req.session.passport) {
            res.redirect('/profile');
        } else {
            next();
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


export const jwtAuth = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, secret);
        if (!decoded) {
            res.status(401).json({ error: "Token inválido" });
        }
        req.user = decoded;
        console.log("Decoded: ", decoded);
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const jwtAuthCookie = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, secret);
        if (!decoded) {
            res.status(401).json({ error: "Token inválido" });
        }
        req.user = decoded;
        console.log("Decoded: ", decoded);
        console.log("req.user: ", req.user);
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}