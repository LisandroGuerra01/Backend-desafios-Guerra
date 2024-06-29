import businessModel from '../../mongoDB/models/business.model.js';
import BasicMongo from '../basicMongo.js';

class BusinessMongo extends BasicMongo {
    constructor() {
        super(businessModel);
    }
}

const businessMongo = new BusinessMongo();

export default businessMongo;