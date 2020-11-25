import { v4 } from 'uuid';
import Grants from '../models/Grants';
import ServerUtility from '../helpers/ServerResponse';
import { errorTypeMap } from '../helpers/reorganizeErrors';

/**
 * @description implements Grants Controller
 */
class GrantsController {
  /**
   * @description - implements create grant method by admin users
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @memberof AuthController
   * @returns {object|function} - returns a response object
   */
  static async createGrant(req, res, next) {
    try {
      const start = new Date();
      const {
        grantName, description, status, expiryDate, applicationStartDate,
        grantType, upload
      } = req.body;

      const existingApplication = await Grants.findOne({
        $and: [{ grantName }, { deleted: false }]
      });

      if (existingApplication) {
        return ServerUtility.errorResponse(
          res,
          409,
          { message: 'A grant with this name already exists' },
          'Grant already exists',
          {},
          { responseTime: `${new Date() - start}ms`, errorType: '001', errorDescription: errorTypeMap['001'] }
        );
      }

      const grantTypeImageMap = {
        grant: 'https://res.cloudinary.com/tolulope-od/image/upload/v1605063040/cytonn-photography-vWchRczcQwM-unsplash_suwbc8.jpg',
        scholarship: 'https://res.cloudinary.com/tolulope-od/image/upload/v1601139589/santi-vedri-O5EMzfdxedg-unsplash_forq9q.jpg',
      };

      const newGrant = new Grants({
        grantId: v4(),
        description,
        grantName,
        grantType,
        // eslint-disable-next-line no-mixed-operators
        status: status && status || 'ACTIVE',
        expiryDate,
        // eslint-disable-next-line no-mixed-operators
        applicationStartDate: applicationStartDate && applicationStartDate || Date.now(),
        createdBy: req.user._id,
        upload,
        image: grantTypeImageMap[grantType],
      });

      const grant = await newGrant.save();
      return ServerUtility.successResponse(
        res, 201, { grant }, 'Grant created successfully', { responseTime: `${new Date() - start}ms` }
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description - implements view grants
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @memberof AuthController
   * @returns {object|function} - returns a response object
   */
  static async getAllGrants(req, res, next) {
    try {
      const start = new Date();
      const {
        status, expiryDateRageStart, expiryDateRangeEnd,
        applicationDateRangeStart, applicationDateRangeEnd,
        pageSize, page,
      } = req.query;

      const itemsPerPage = pageSize || 10;
      const numberOfPages = Math.max(0, page) || 0;
      const queryOpts = {
        ...(status ? { status } : { status: 'ACTIVE' }),
        ...(applicationDateRangeStart && applicationDateRangeEnd ? {
          applicationStartDate: { $gte: applicationDateRangeStart, $lte: applicationDateRangeEnd },
        } : {}),
        ...(expiryDateRageStart && expiryDateRangeEnd ? {
          expiryDate: { $gte: expiryDateRageStart, $lte: expiryDateRangeEnd },
        } : {}),
      };
      const grants = await Grants.find({
        ...queryOpts,
      }).populate('createdBy', ['_id', 'firstName', 'lastName'])
        .limit(parseInt(itemsPerPage, 10))
        .skip(parseInt(itemsPerPage, 10) * parseInt(numberOfPages, 10))
        .sort({
          createdOn: -1,
        });

      const totalCount = await Grants.count({
        ...queryOpts,
      });

      return ServerUtility.successResponse(
        res,
        200,
        { grants },
        'Grants fetched successfully',
        {
          responseTime: `${new Date() - start}ms`,
          totalCount,
          currentCount: grants.length,
          page,
          pageSize,
        }
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description - implements updating/editing a grant
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @memberof AuthController
   * @returns {object|function} - returns a response object
   */
  static async updateAGrant(req, res, next) {
    try {
      const start = new Date();
      const {
        grantName, description, status, expiryDate, applicationStartDate,
        grantType,
      } = req.body;
      const { grantId } = req;

      const grantFields = {
        ...(grantName ? { grantName } : {}),
        ...(grantType ? { grantType } : {}),
        ...(description ? { description } : {}),
        ...(status ? { status } : {}),
        ...(expiryDate ? { applicationStartDate } : {}),
        updatedOn: Date.now(),
        updatedBy: req.user._id,
      };

      const updatedGrant = await Grants.findOneAndUpdate(
        { _id: grantId },
        { $set: grantFields },
        { new: true },
      );

      return ServerUtility.successResponse(
        res, 200, { grant: updatedGrant }, 'Grant updated successfully', { responseTime: `${new Date() - start}ms` }
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description - implements get a grant by id
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @memberof AuthController
   * @returns {object|function} - returns a response object
   */
  static async getGrantById(req, res, next) {
    try {
      const start = new Date();
      const { findGrant } = req;

      return ServerUtility.successResponse(
        res, 200, { grant: findGrant }, 'Grant fetched successfully', { responseTime: `${new Date() - start}ms` }
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description - implements delete a grant
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @memberof AuthController
   * @returns {object|function} - returns a response object
   */
  static async deleteAGrant(req, res, next) {
    try {
      const start = new Date();
      const { grantId } = req;

      const grantFields = {
        deleted: true,
        updatedOn: Date.now(),
        updatedBy: req.user._id,
      };
      await Grants.findOneAndUpdate(
        { _id: grantId },
        { $set: grantFields },
        { new: true },
      );
      return ServerUtility.successResponse(
        res, 200, { grant: null }, 'Grant delete successfully', { responseTime: `${new Date() - start}ms` }
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default GrantsController;
