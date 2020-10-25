import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import AuthValidator from '../validators/AuthValidator';
import Permissions from '../middlewares/Permissions';

const router = Router();

router.post(
  '/register',
  AuthValidator.validateRegistration,
  AuthController.registerUser,
);
router.post(
  '/login',
  AuthValidator.validateLogin,
  AuthController.login,
);
router.patch(
  '/change-password',
  Permissions.authenticateJWTFromRequest,
  Permissions.checkPassword,
  AuthValidator.validatePasswordChangeAuthorized,
  AuthController.changePasswordAuthorized,
);

export default router;
