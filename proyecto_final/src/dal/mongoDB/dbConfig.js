import mongoose from 'mongoose';
import config from '../../config/config.js';
import { logger } from '../../utils/logger.utils.js'

const URI = config.mongo_uri;

const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        // console.log('MongoDB connected');
        logger().info('MongoDB connected');
    } catch (error) {
        // console.log(error);
        logger().error(error);
    }
}

export default connectDB;