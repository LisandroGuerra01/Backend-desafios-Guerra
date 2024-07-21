import { logger } from "../utils/logger.utils.js";

class UsersLogger {
    handleRequest = (req, res) => {
        try {
            logger().info('Request processed successfully');
            res.status(200).send('Request processed successfully');
        } catch (error) {
            logger.error(error.message, error);
            res.status(500).send("Internal Server Error");
        }
    };

    loggerAllUsers = (req, res) => {
        try {
            logger().info('Usuarios obtenidos');
            res.status(200).send('Request processed successfully');
        } catch (error) {
            logger.error(error.message, error);
            res.status(500).send("Internal Server Error");
        }
    }
}

const usersLogger = new UsersLogger();

export default usersLogger;