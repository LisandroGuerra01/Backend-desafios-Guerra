import usersMongo from '../dal/daos/usersDaos/usersMongo.js';
import { hashData, compareData } from '../utils/bcrypt.utils.js';
import { generateToken, verifyToken, generateTokenResetPassword, verifyTokenResetPassword, decodeTokenResetPassword } from '../utils/jwt.utils.js';
import { UsersDTO, UsersViewDTO } from '../dal/dtos/users.dto.js';
import config from '../config/config.js';
import emailService from '../utils/emailService.utils.js';
import moment from 'moment';


class UsersService {
    async findAll() {
        try {
            const result = await usersMongo.findAll();
            const usersViewDTO = result.map(user => new UsersViewDTO(user));
            return usersViewDTO;
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            const result = await usersMongo.findById(id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async create(users) {
        if (users.name == null || users.email == null || users.password == null || users.age == null) {
            return { error: 'Completar todos los datos' }
        }
        const { password } = users;
        try {
            const hashPassword = await hashData(password);
            const newUsers = { ...users, password: hashPassword };
            const usersDTO = new UsersDTO(newUsers);
            const result = await usersMongo.create(usersDTO);
            return result;
        } catch (error) {
            return error;
        }
    }

    async update(id, users) {
        try {
            const result = await usersMongo.update(id, users);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const result = await usersMongo.delete(id);
            const email = result.email;
            if (email) {
                const emailBody = {
                    to: email,
                    subject: 'Usuario eliminado por inactividad',
                    html: `<p>Se ha eliminado tu usuario por permanecer demasiado tiempo inactivo. Para continuar, deberás crear un usuario nuevo </p>
                    <a href="${url}">Crear usuario:</a>`
                }
                const emailResult = await emailService.sendEmail(emailBody.to, emailBody.subject, emailBody.html);
                return emailResult;
            }
            return null;
        } catch (error) {
            return error;
        }
    }

    async deleteIfInactive(id) {
        try {
            const user = await usersMongo.findById(id);

            if (!user) {
                return null;
            }

            const lastConnection = user.last_connection;
            const now = moment();
            const diff = now.diff(lastConnection, 'minutes ');

            if (diff > 20) {
                const result = await usersMongo.delete(id);
                return result;
            } else {
                return { message: 'El usuario se conectó hace menos de 2 días' };
            }
        } catch (error) {
            return error;
        }
    }

    async deleteSoft(id) {
        try {
            const result = await usersMongo.deleteSoft(id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async login(users) {
        const { password, email } = users;
        try {
            if (email === config.admin_email && password === config.admin_password) {
                const userAdmin = {
                    email,
                    role: "admin"
                }
                const token = generateToken(userAdmin);
                return token;
            }
            const result = await usersMongo.findByField('email', email);
            if (result) {
                const { password: hashPassword } = result[0];
                const isMatch = await compareData(password, hashPassword);
                if (isMatch) {
                    const token = generateToken(result[0]);
                    usersMongo.update(result[0].id, { last_connection: new Date() })
                    return token;
                }
                return null;
            }
            return null;
        }
        catch (error) {
            return error;
        }
    }

    async logout(email) {
        try {
            const result = await usersMongo.updateEmail(email, { last_connection: new Date() });
            return result;
        } catch (error) {
            return error;
        }
    }

    async current(token) {
        try {
            const { id, email, role } = verifyToken(token);
            if (role === "admin") {
                const userAdmin = {
                    email,
                    role
                }
                return userAdmin;
            }
            const result = await usersMongo.findById(id);
            const usersViewDTO = new UsersViewDTO(result);
            return usersViewDTO;
        } catch (error) {
            return error;
        }
    }

    async forgotPassword(email) {
        try {
            const result = await usersMongo.findByField('email', email);
            if (result) {
                const token = generateTokenResetPassword(result[0]);
                const url = `${config.url_frontend}/reset-password/${token}`;
                const emailBody = {
                    to: email,
                    subject: 'Recuperación de contraseña',
                    html: `<p>Hola, has solicitado recuperar tu contraseña. Para continuar, haz click en el </p>
                    <a href="${url}">siguiente enlace:</a>
                    <p>Si no has solicitado recuperar tu contraseña, puedes ignorar este correo electrónico.</p>`
                }
                const emailResult = await emailService.sendEmail(emailBody.to, emailBody.subject, emailBody.html);
                return emailResult;
            }
            return null;
        } catch (error) {
            return error;
        }
    }

    async validateToken(token) {
        try {
            const result = verifyTokenResetPassword(token);
            return result;
        } catch (error) {
            return error;
        }
    }

    async resetPassword(data) {
        try {
            const { token, password } = data;

            //Verificar que el token sea valido y que no haya expirado
            const isValid = verifyTokenResetPassword(token);
            if (!isValid) {
                return null;
            }
            const { id } = decodeTokenResetPassword(token);
            const hashPassword = await hashData(password);

            //Verificar que la contraseña no sea igual a la anterior
            const user = await usersMongo.findById(id);
            const { password: hashPasswordOld } = user;
            const isMatch = await compareData(hashPassword, hashPasswordOld);
            if (isMatch) {
                return null;
            }
            const result = await usersMongo.update(id, { password: hashPassword });
            return result;
        } catch (error) {
            return error;
        }
    }

    async changeRole(id) {
        try {
            const result = await usersMongo.findById(id);
            const { role } = result;
            let newRole = "";
            if (role === "user") {
                newRole = "premium";
            } else {
                newRole = "user";
            }
            const resultUpdate = await usersMongo.update(id, { role: newRole });
            return resultUpdate;
        } catch (error) {
            return error;
        }
    }

    async updateUserStatus(uid, status) {
        try {
            const result = await usersMongo.update(uid, { statusDocuments: status });
            return result;
        } catch (error) {
            return error;
        }
    }
}

const usersService = new UsersService();

export default usersService;