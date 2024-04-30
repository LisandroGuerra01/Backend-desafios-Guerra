import dotenv from 'dotenv';

dotenv.config(
//     {
//     path: environment === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
// }
);


export default {
    MONGO_ATLAS_URL: process.env.MONGO_ATLAS_URL,
    PORT: process.env.PORT,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
}