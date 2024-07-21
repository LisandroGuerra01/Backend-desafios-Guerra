import winston from 'winston';
import config  from '../config/config.js'

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'green',
        http: 'grey',
        debug: 'cyan'
    }

};

//Crear el logger de desarrollo
const developmentLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error', format: winston.format.simple() }),
        new winston.transports.File({ filename: 'logs/combined.log', format: winston.format.simple() })
    ]
});

//Crear el logger de produccion
const productionLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    // format: winston.format.simple(),
    transports: [
        new winston.transports.Console({
            level: 'http',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

const ENV = config.node_env

//Creo el metodo logger para exportar developmentLogger y productionLogger
export const logger = () => {
    if (ENV === 'dev') {
        return developmentLogger
    } else {
        return productionLogger
    }
}