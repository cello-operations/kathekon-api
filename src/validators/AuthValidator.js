import Joi from '@hapi/joi';
import ServerUtility from '../helpers/ServerResponse';
import reorganizeValidationErrors, { errorTypeMap } from '../helpers/reorganizeErrors';

/**
 * @description implements Auth Validator class
 */
class AuthValidator {
  /**
   * @description - implements registration request body validator
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function call
   * @return {object|function} - returns a response object if validation fails or a function if it passess
   */
  static validateRegistration(req, res, next) {
    const start = new Date();
    const schema = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      phoneNumber: Joi.string(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = reorganizeValidationErrors(error.details);

      return ServerUtility.errorResponse(res, 400, errorMessages, 'Validation error', {}, {
        errorType: '001', responseTime: `${new Date() - start}ms`, errorDescription: errorTypeMap['001'],
      });
    }

    return next();
  }

  /**
   * @description - implements login request body validator
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function call
   * @return {object|function} - returns a response object if validation fails or a function if it passess
   */
  static validateLogin(req, res, next) {
    const start = new Date();
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = reorganizeValidationErrors(error.details);

      return ServerUtility.errorResponse(res, 400, errorMessages, 'Validation error', {}, {
        errorType: '001', responseTime: `${new Date() - start}ms`, errorDescription: errorTypeMap['001'],
      });
    }

    return next();
  }

  /**
   * @description - implements change password request body validator
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function call
   * @return {object|function} - returns a response object if validation fails or a function if it passess
   */
  static validatePasswordChangeAuthorized(req, res, next) {
    const start = new Date();
    const schema = Joi.object().keys({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().alphanum().required(),
      confirmNewPassword: Joi.string().required(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = reorganizeValidationErrors(error.details);

      return ServerUtility.errorResponse(res, 400, errorMessages, 'Validation error', {}, {
        errorType: '001', responseTime: `${new Date() - start}ms`, errorDescription: errorTypeMap['001'],
      });
    }

    return next();
  }
}

export default AuthValidator;
