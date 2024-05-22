import winston from 'winston';

//Defino los niveles de prioridad de los msj de log de menor a mayor
const levels = {
    debug: 0,
    http: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5
};

//Defino los colores de los msj de log para cada nivel deprioridad de menor a mayor
const colors = {
    debug: 'blue',
    http: 'green',
    info: 'cyan',
    warn: 'yellow',
    error: 'red',
    fatal: 'magenta'
};

//Crear el logger de desarrollo
const developmentLogger = winston.createLogger({
    levels,
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors }),
                winston.format.simple()
            )
        })
    ]
});

//Crear el logger de produccion
const productionLogger = winston.createLogger({
    levels,
    // format: winston.format.simple(),
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

//Exporto el logger correspondiente según el entorno de ejecución (development o production)
export const logger = (env) => {
    if (env === 'development') {
        return developmentLogger;
    } else {
        return productionLogger;
    }
}