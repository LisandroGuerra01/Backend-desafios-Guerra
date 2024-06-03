import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command(); //Crea la instancia de comandos de commander.

program
    .option('-d', 'Variable para debug', false)
    .option('--persist <mode>', 'Modo de persistencia', "mongodb")
    .option('--mode <mode>', 'Modo de trabajo', 'dev')
program.parse();

//console.log("Options: ", program.opts());
console.log("Persistence Mode Option: ", program.opts().persist);
console.log("Environment Mode Option: ", program.opts().mode);

// process.on('exit', code => {
//     console.log("Este codigo se ejecuta antes de salir del proceso.");
//     console.log("Codigo de salida del process. ", code);
// })


// process.on('uncaughtException', exception => {
//     console.log("Esta exception no fue capturada, o controlada.");
//     console.log("Exception no capturada: ", exception);
// })


// process.on('message', message => {
//     console.log("Este codigo se ejecutará cuando reciba un mensaje de otro proceso.");
//     console.log(`Mensaje recibido: ${message}`);
// })

const environment = program.opts().mode;
dotenv.config({
    path: environment === "prod" ? "./src/config/.env.production" : "./src/config/.env.development"
});

export default {
    mongo_uri: process.env.MONGO_ATLAS_URL,
    port: process.env.PORT,
    secretKey: process.env.SECRETKEY,
    secretKeyReset: process.env.SECRETKEYRESET,
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
    node_env: process.env.NODE_ENV,
    mailing_user: process.env.MAILING_USER,
    mailing_password: process.env.MAILING_PASSWORD,
    mailing_service: process.env.MAILING_SERVICE,
    mailing_port: process.env.MAILING_PORT,
    url_frontend: process.env.URL_FRONTEND
}