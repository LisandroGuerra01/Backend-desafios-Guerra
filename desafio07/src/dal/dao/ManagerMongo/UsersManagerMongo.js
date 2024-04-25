import { usersModel } from "../../models/users.model.js";

//Clase que se encarga de manejar los usuarios en la base de datos de mongo
export default class UsersManager {

    //Busca el usuario por email y devuelve el usuario
    async getUserByEmail(email) {
        try {
            const user = await usersModel.findOne({ email });
            return user;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    //Busca el usuario por id y devuelve el usuario
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