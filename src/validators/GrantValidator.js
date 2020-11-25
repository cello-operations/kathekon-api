import Joi from '@hapi/joi';
import ServerUtility from '../helpers/ServerResponse';
import reorganizeValidationErrors, { errorTypeMap } from '../helpers/reorganizeErrors';
import MongooseHelper from '../helpers/MongooseHelper';
import Grants from '../models/Grants';
import GrantApplications from '../models/GrantApplications';

/**
 * @description implements Grant Validator class
 */
class GrantValidator {
  /**
   * @description - implements validator for grant creation
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function call
   * @member GrantValidator
   * @return {object|function} - returns a response object if validation fails or a function if it passes
   */
  static validateGrantCreation(req, res, next) {
    const start = new Date();
    const schema = Joi.object({
      grantName: Joi.string().required(),
      description: Joi.string().required(),
      status: Joi.string(),
      expiryDate: Joi.date(),
      applicationStartDate: Joi.string(),
      grantType: Joi.string().required(),
      upload: Joi.string().required(),
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
   * @description - implements validator for grant existence
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function call
   * @member GrantValidator
   * @return {object|function} - returns a response object if validation fails or a function if it passes
   */
  static async validateGrantExists(req, res, next) {
    const start = new Date();
    const { grantId } = req.params;

    const validId = MongooseHelper.validateObjectId(grantId);

    if (!validId) {
      return ServerUtility.errorResponse(
        res,
        400,
        { message: 'Please provide a valid ID' },
        'Please provide a valid ID',
        {},
        { responseTime: `${new Date() - start}ms`, errorType: '001', errorDescription: errorTypeMap['001'] }
      );
    }

    const findGrant = await Grants.findOne({ _id: grantId, deleted: false })
      .populate('createdBy', ['firstName', 'lastName']);

    if (!findGrant) {
      return ServerUtility.errorResponse(
        res,
        404,
        { message: 'This grant does not exist or may have been deleted' },
        'This grant does not exist or may have been deleted',
        {},
        { responseTime: `${new Date() - start}ms`, errorType: '001', errorDescription: errorTypeMap['001'] }
      );
    }

    req.grantId = grantId;
    req.findGrant = findGrant;
    return next();
  }

  /**
   * @description - implements validator for grant application duplicate
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function call
   * @member GrantValidator
   * @return {object|function} - returns a response object if validation fails or a function if it passes
   */
  static async checkIfApplicationIsDuplicate(req, res, next) {
    const start = new Date();
    const { grantId } = req;
    const findGrantApplication = await GrantApplications.findOne({ grantId, requestedBy: req.user._id });
    if (findGrantApplication) {
      return ServerUtility.errorResponse(
        res,
        409,
        { message: 'You have already applied for this grant' },
        'You have already applied for this grant',
        {},
        { responseTime: `${new Date() - start}ms`, errorType: '001', errorDescription: errorTypeMap['001'] }
      );
    }
    return next();
  }

  static async checkIfResponseIsDuplicate(req, res, next) {
    const start = new Date();
    const { grantApplicationId } = req.params;
    const findGrantApplication = await GrantApplications.findOne({ _id: grantApplicationId });
    if (!findGrantApplication) {
      return ServerUtility.errorResponse(
        res,
        404,
        { message: 'Grant does not exist' },
        'This grant does not exist or may have been moved',
        {},
        { responseTime: `${new Date() - start}ms`, errorType: '001', errorDescription: errorTypeMap['001'] }
      );
    }

    if (findGrantApplication && findGrantApplication.status !== 'PROCESSING') {
      return ServerUtility.errorResponse(
        res,
        409,
        { message: 'This grant has already been treated' },
        'This grant has already been treated and cannot be updated again',
        {},
        { responseTime: `${new Date() - start}ms`, errorType: '001', errorDescription: errorTypeMap['001'] }
      );
    }
    return next();
  }

  static async checkIfGrantApplicationExists(req, res, next) {
    const { status } = req.body;
    const start = new Date();
    const { grantApplicationId } = req.params;

    const validId = MongooseHelper.validateObjectId(grantApplicationId);

    if (!validId) {
      return ServerUtility.errorResponse(
        res,
        400,
        { message: 'Please provide a valid ID' },
        'Please provide a valid ID',
        {},
        { responseTime: `${new Date() - start}ms`, errorType: '001', errorDescription: errorTypeMap['001'] }
      );
    }

    const findGrantApplication = await Grants.findOne({ _id: grantApplicationId, deleted: false })
      .populate('createdBy', ['firstName', 'lastName']);

    if (!findGrantApplication) {
      return ServerUtility.errorResponse(
        res,
        404,
        { message: 'This grant application does not exist or may have been deleted' },
        'This grant application does not exist or may have been deleted',
        {},
        { responseTime: `${new Date() - start}ms`, errorType: '001', errorDescription: errorTypeMap['001'] }
      );
    }

    // eslint-disable-next-line no-mixed-operators
    if (findGrantApplication && findGrantApplication.status === 'APPROVED'
      // eslint-disable-next-line no-mixed-operators
      || findGrantApplication.status === 'DECLINED'
      || findGrantApplication.status === 'ARCHIVED'
    ) {
      return ServerUtility.errorResponse(
        res,
        409,
        { message: `This grant application has already been ${status.toLowerCase()} and cannot be ${status.lowerCase()} again` },
        `This request has already been ${status.toLowerCase()}`,
        {},
        { responseTime: `${new Date() - start}ms`, errorType: '001', errorDescription: errorTypeMap['001'] }
      );
    }

    req.grantApplicationId = grantApplicationId;
    req.grantApplication = findGrantApplication;
    return next();
  }
}

export default GrantValidator;
