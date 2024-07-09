import usersModel from '../../mongoDB/models/users.model.js';
import BasicMongo from '../basicMongo.js';

class UsersMongo extends BasicMongo {
    constructor() {
        super(usersModel);
    }

    async updateEmail(email, data) {
        try {
            const result = await this.model.findOneAndUpdate({ email }, data, { new: true });
            return result;
        } catch (error) {
            return error;
        }
    }

    async findUserInactive(query) {
        try {
            const result = await this.model.find(query);
            return result;
        } catch (error) {
            return error;
        }
    }

    async deleteMany(query) {
        try {
            const result = await this.model.deleteMany(query);
            return result;
        } catch (error) {
            return error;
        }
    }
}

const usersMongo = new UsersMongo();

export default usersMongo;