import { Router } from 'express';
import SystemController from '../controllers/SystemController';

const systemRouter = Router();

systemRouter.get('/logs', SystemController.getAllLogs);
systemRouter.get('/error-logs', SystemController.getAllErrorLogs);

export default systemRouter;
