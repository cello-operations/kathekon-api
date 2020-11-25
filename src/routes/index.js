import { Router } from 'express';
import ServerUtility from '../helpers/ServerResponse';
import authRouter from './authRoutes';
import systemRouter from './systemRoutes';
import grantsRouter from './grantsRoutes';
import blogsRouter from './blogRoutes';

const router = Router();

router.get('/', (req, res) => {
  const start = new Date();
  return ServerUtility.successResponse(
    res, 200, { apiVersion: 1 }, 'Kathekon API Version 1', { responseTime: `${new Date() - start}ms` }
  );
});

router.use('/auth', authRouter);
router.use('/system', systemRouter);
router.use('/grants', grantsRouter);
router.use('/blogs', blogsRouter);

export default router;
