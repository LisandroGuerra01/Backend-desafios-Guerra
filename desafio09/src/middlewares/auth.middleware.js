import { verifyToken } from "../utils/jwt.utils.js";

//Verificar usuarios logueados
export const verifyTokenAuth = (req, res, next) => {
    try {
        const token = req.cookie.token;
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json("Unauthorized")
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json("Unauthorized")
    }
}

//Verificar usuario logueado que es admin
export const verifyTokenAdmin = (req, res, next) => {
    try {
        const token = req.cookie.token;
        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== "admin") {
            return res.status(401).json("Unauthorized")
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json("Unauthorized")
    }
}

//Verificar usuario logueado que es user
export const verifyTokenUser = (req, res, next) => {
    try {
        const token = req.cookie.token;
        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== "user") {
            return res.status(401).json("Unauthorized")
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json("Unauthorized")
    }
}