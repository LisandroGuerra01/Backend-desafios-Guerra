import { logger } from '../utils/logger.utils.js'

export const logRequest = (req, res, next) => {
    logger().info(`Request: [${req.method}] ${req.originalUrl} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    next();
}