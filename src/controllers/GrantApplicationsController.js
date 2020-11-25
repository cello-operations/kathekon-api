import GrantApplications from '../models/GrantApplications';
import EmailService from '../services/EmailService';
import ServerUtility from '../helpers/ServerResponse';

/**
 * @description implements Grant Applications Controller
 */
class GrantApplicationsController {
  /**
   * @description - implements user requesting a grant
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @memberof AuthController
   * @returns {object|function} - returns a response object
   */
  static async requestGrant(req, res, next) {
    try {
      const { grantId, findGrant } = req;
      const { applicationDocument } = req.body;
      const start = new Date();
      const newGrantApplication = new GrantApplications({
        grantId,
        requestedBy: req.user._id,
        status: 'PROCESSING',
        applicationDocument,
      });

      const grantApplication = await newGrantApplication.save();
      const emailService = new EmailService(req.user.email, 'Your grant application on Kathēkon');
      const emailData = {
        frontendURL: process.env.FRONTEND_URL,
        firstName: req.user.firstName,
        supportEmail: process.env.SUPPORT_EMAIL,
        grantName: findGrant.grantName,
      };

      await emailService.sendEmail('newapplication', emailData);
      return ServerUtility.successResponse(
        res,
        201,
        { grant: grantId, grantApplication },
        'Grant application created successfully and we will be in touch shortly',
        { responseTime: `${new Date() - start}ms` },
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description - implements getting a grant application
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @memberof AuthController
   * @returns {object|function} - returns a response object
   */
  static async getAllGrantApplications(req, res, next) {
    try {
      const start = new Date();
      const {
        status, applicationDateRangeStart, applicationDateRangeEnd,
        pageSize, page,
      } = req.query;
      const itemsPerPage = pageSize || 10;
      const numberOfPages = Math.max(0, page) || 0;

      const queryOpts = {
        ...(status ? { status } : { }),
        ...(applicationDateRangeStart && applicationDateRangeEnd ? {
          createdOn: { $gte: applicationDateRangeStart, $lte: applicationDateRangeEnd },
        } : {}),
        ...(req.user.userType === 'REQUESTER' ? { requestedBy: req.user._id } : { })
      };

      const grantApplications = await GrantApplications.find({
        ...queryOpts,
      }).populate('requestedBy')
        .populate('grantId')
        .limit(parseInt(itemsPerPage, 10))
        .skip(parseInt(itemsPerPage, 10) * parseInt(numberOfPages, 10))
        .sort({
          createdOn: -1,
        });
      const totalCount = await GrantApplications.count({
        ...queryOpts,
      });

      return ServerUtility.successResponse(
        res,
        200,
        { grantApplications },
        'Grants fetched successfully',
        {
          responseTime: `${new Date() - start}ms`,
          totalCount,
          currentCount: grantApplications.length,
          page,
          pageSize,
        }
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description - implements treating a grant application
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @memberof AuthController
   * @returns {object|function} - returns a response object
   */
  static async treatGrantApplication(req, res, next) {
    try {
      const start = new Date();
      const { status } = req.body;
      const { grantApplicationId } = req.params;

      const grantApplicationFields = {
        status,
        updatedOn: Date.now(),
        treatedBy: req.user._id,
      };
      const treated = await GrantApplications.findOneAndUpdate(
        { _id: grantApplicationId },
        { $set: grantApplicationFields },
        { new: true },
      );
      return ServerUtility.successResponse(
        res,
        200,
        { grantApplication: treated },
        `Grant ${status.toLowerCase()} successfully`,
        {
          responseTime: `${new Date() - start}ms`,
        }
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default GrantApplicationsController;
