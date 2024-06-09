import express from 'express';
import config from './config/config.js';
import connectDB from './dal/mongoDB/dbConfig.js';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/api.router.js';
import compression from 'express-compression';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { logger } from './utils/logger.utils.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { __dirname } from './utils/dirname.utils.js';


const app = express();
const NODE_ENV = config.node_env
const log = logger(NODE_ENV);

app.use(compression());

connectDB();

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion API Ecommerce',
            description: 'Documentacion de la API de Ecommerce',
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', apiRouter);

app.use(errorMiddleware);

const PORT = config.port;

app.listen(PORT, () => {
    // console.log(`Server is running on port ${PORT}`);
    log.info(`Server is running on port ${PORT}`);
});