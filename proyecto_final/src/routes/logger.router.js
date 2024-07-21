import { logRequest } from '../middlewares/logger.middleware.js';
import { Router } from 'express';

const router = Router();

router.get('/loggerTest', logRequest);

export default router;