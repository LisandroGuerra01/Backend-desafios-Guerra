import dotenv from 'dotenv';
import {Command} from 'commander';

const program = new Command(); //Crea la instancia de comandos de commander.

program
    .option('-d', 'Variable para debug', false)
    .option('--persist <mode>', 'Modo de persistencia', "mongodb")
    .option('--mode <mode>', 'Modo de trabajo', 'dev')
program.parse();

//console.log("Options: ", program.opts());
console.log("Environment Mode Option: ", program.opts().mode);
console.log("Persistence Mode Option: ", program.opts().persist);

const environment = program.opts().mode;
dotenv.config({
    path:environment==="prod"?"./src/config/.env.production":"./src/config/.env.development"
});

export default {
    mongo_uri: process.env.MONGO_URI,
    port: process.env.PORT,
    secretKey: process.env.SECRETKEY,
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
}