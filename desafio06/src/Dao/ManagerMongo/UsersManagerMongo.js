import { usersModel } from "../../db/models/users.model.js";
import { hashPassword, comparePassword } from "../../bcrypt/bcrypt.js";

export default class UsersManager {
    async loginUser(user) {
        // const { email, password } = user;
        try {
            const { email, password } = user;
            const userLogged = await usersModel.findOne({ email });
            if (!userLogged) {
                return false;
            } else {
                const isMatch = comparePassword(password, userLogged.password);
                if (isMatch) {
                    return userLogged;
                } else {
                    return false;
                }
            }
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async getUserById(id) {
        try {
            const user = await usersModel.findById(id);
            return user;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}