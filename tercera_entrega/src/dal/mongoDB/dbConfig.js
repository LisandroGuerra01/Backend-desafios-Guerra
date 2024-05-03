import mongoose from 'mongoose';
import config from '../../config/config.js';

const URI = config.mongo_uri;

const connectDB = async () => {
    try {
        await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;