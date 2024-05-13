import express from 'express';
import config from './config/config.js';
import connectDB from './dal/mongoDB/dbConfig.js';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/api.router.js';
import compression from 'express-compression';
import { errorMiddleware } from './middlewares/error.middleware.js';


const app = express();

app.use(compression());

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', apiRouter);

app.use(errorMiddleware);

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});