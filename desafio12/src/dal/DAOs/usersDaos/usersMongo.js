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

}

const usersMongo = new UsersMongo();

export default usersMongo;