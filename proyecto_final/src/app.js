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
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import cron from 'node-cron';
import usersService from './services/users.service.js';


const app = express();
const log = logger();

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

// Configurar Handlebars y registrar el helper 'eq'
const hbs = handlebars.create({
  helpers: {
    eq: function (a, b) {
      return a === b;
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', apiRouter);
app.use('/', viewsRouter);

app.use(errorMiddleware);

cron.schedule('29 1 * * *', async () => {
    await usersService.deleteIfInactive();
    log.info('Usuarios inactivos eliminados');
});

const PORT = config.port;
const ENV = config.node_env;

app.listen(PORT, () => {
    log.info(`Server corriendo en puerto ${PORT}`);
    log.info(`Enviroment: ${ENV}`);
});