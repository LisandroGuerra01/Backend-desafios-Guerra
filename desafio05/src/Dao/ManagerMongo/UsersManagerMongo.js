import { usersModel } from "../../db/models/users.model.js";

export default class usersManager {
    async createUser(user) {
        const { email } = user;
        try {
            const existUser = await usersModel.findOne({ email });
            if (existUser) {
                return false;
            }
            const newUser = await usersModel.create(user);
            return newUser;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async loginUser(user) {
        const { email, password } = user;
        try {
            const userLogged = await usersModel.findOne({ email, password });
            if (!userLogged) {
                return false;
            }
            return userLogged;
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