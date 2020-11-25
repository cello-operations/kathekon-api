import { Router } from 'express';
import GrantsController from '../controllers/GrantsController';
import GrantValidator from '../validators/GrantValidator';
import Permissions from '../middlewares/Permissions';
import GrantApplicationsController from '../controllers/GrantApplicationsController';

const grantsRouter = Router();

grantsRouter.post(
  '/',
  Permissions.authenticateJWTFromRequest,
  Permissions.allowOnly(['ADMIN', 'SUPER_ADMIN']),
  GrantValidator.validateGrantCreation,
  GrantsController.createGrant,
);

grantsRouter.get(
  '/',
  GrantsController.getAllGrants,
);

grantsRouter.get(
  '/applications',
  Permissions.authenticateJWTFromRequest,
  GrantApplicationsController.getAllGrantApplications,
);

grantsRouter.get(
  '/:grantId',
  GrantValidator.validateGrantExists,
  GrantsController.getGrantById,
);

grantsRouter.patch(
  '/:grantId',
  Permissions.authenticateJWTFromRequest,
  Permissions.allowOnly(['ADMIN', 'SUPER_ADMIN']),
  GrantValidator.validateGrantExists,
  GrantValidator.validateGrantCreation,
  GrantsController.updateAGrant,
);

grantsRouter.delete(
  '/:grantId',
  Permissions.authenticateJWTFromRequest,
  Permissions.allowOnly(['ADMIN', 'SUPER_ADMIN']),
  GrantValidator.validateGrantExists,
  GrantValidator.validateGrantCreation,
  GrantsController.updateAGrant,
);

grantsRouter.post(
  '/application/:grantId',
  Permissions.authenticateJWTFromRequest,
  Permissions.allowOnly(['REQUESTER']),
  GrantValidator.validateGrantExists,
  GrantValidator.checkIfApplicationIsDuplicate,
  GrantApplicationsController.requestGrant,
);

grantsRouter.patch(
  '/applications/:grantApplicationId',
  Permissions.authenticateJWTFromRequest,
  Permissions.allowOnly(['ADMIN', 'SUPER_ADMIN']),
  GrantValidator.checkIfResponseIsDuplicate,
  GrantApplicationsController.treatGrantApplication,
);

export default grantsRouter;
