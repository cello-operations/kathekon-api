import passport from 'passport';
import ServerUtility from '../helpers/ServerResponse';
import UserService from '../services/UserService';
import { errorTypeMap } from '../helpers/reorganizeErrors';

/**
 * @description implements permissions class for user actions
 */
class Permissions {
  /**
   * @description - implements JWT authentication for protected routes
   * @param {object} req - request object
   * @param {object} res - response object
   * @memberof Permissions
   * @returns {object|function} - returns the response object if there's a failure and the next function on success
   */
  static authenticateJWTFromRequest(req, res, next) {
    const start = new Date();
    // eslint-disable-next-line no-unused-vars
    passport.authenticate('jwt', (error, user, info) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        return ServerUtility.errorResponse(res, 401, { message: 'Unauthorized access, please check credentials and try again' }, 'Invalid credentials', {}, {
          errorType: '000', responseTime: `${new Date() - start}ms`, errorDescription: errorTypeMap['000'],
        });
      }

      req.user = user._doc;
      next();
    })(req, res, next);
  }

  /**
   * @description - implements route protection for user-type protected routes
   * @param {Array} allowedUsers - request object
   * @memberof Permissions
   * @returns {function} - returns a function that acts as a wrapper for the middleware
   */
  static allowOnly(allowedUsers) {
    const start = new Date();
    return (req, res, next) => {
      const { userType } = req.user;

      if (allowedUsers.includes(userType)) {
        return next();
      }

      return ServerUtility.errorResponse(
        res,
        403,
        { message: 'You are not allowed to do that' },
        'Unauthorized action', {
          errorType: '101', responseTime: `${new Date() - start}ms`, errorDescription: errorTypeMap['101'],
        }
      );
    };
  }

  /**
   * @description - implements password check for old password when changing a password
   * @param {object} req - request object
   * @param {object} res - response object
   * @memberof Permissions
   * @returns {object|function} - returns the response object if there's a failure and the next function on success
   */
  static checkPassword(req, res, next) {
    const start = new Date();
    const { oldPassword } = req.body;

    if (!oldPassword) {
      return ServerUtility.errorResponse(res, 400, { message: 'Please provide current password' }, 'Invalid credentials', {}, {
        errorType: '000', responseTime: `${new Date() - start}ms`, errorDescription: errorTypeMap['000'],
      });
    }

    const userPasswordMatch = UserService.comparePasswords(oldPassword, req.user.password);

    if (!userPasswordMatch) {
      return ServerUtility.errorResponse(res, 401, { message: 'Please enter the correct password and try again' }, 'Invalid credentials', {}, {
        errorType: '000', responseTime: `${new Date() - start}ms`, errorDescription: errorTypeMap['000'],
      });
    }

    return next();
  }
}

export default Permissions;
