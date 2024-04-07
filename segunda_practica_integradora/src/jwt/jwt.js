import jwt from 'jsonwebtoken';

//Secret key
const secret = 'Secretkey';

//Generar un token con la información del usuario
export const generateToken = (user) => {
    const data = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.ast_name,
        age: user.age,
        role: user.role,
    };
    return jwt.sign(data, secret, { expiresIn: '1h' });
}