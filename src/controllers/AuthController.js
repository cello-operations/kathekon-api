import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import UserService from '../services/UserService';
import EmailService from '../services/EmailService';
import ServerUtility from '../helpers/ServerResponse';
import { errorTypeMap } from '../helpers/reorganizeErrors';

/**
 * @description implements Authentication Controller
*/
class AuthController {
  /**
   * @description - implements user registration method
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @memberof AuthController
   * @returns {object|function} - returns a response object
   */
  static async registerUser(req, res, next) {
    try {
      const start = new Date();
      const {
        firstName, lastName, email, password,
        phoneNumber,
      } = req.body;

      // check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
      if (existingUser) {
        return ServerUtility.errorResponse(
          res,
          409,
          { message: 'A user with that email or phone number exists' },
          'A user with that email or phone number exists',
          {},
          { responseTime: `${new Date() - start}ms`, errorType: '000', errorDescription: errorTypeMap['000'] }
        );
      }

      const userService = new UserService(email, password);
      const avatar = userService.generateDefaultAvatar();

      const newUser = new User({
        id: uuidv4(),
        firstName,
        lastName,
        phoneNumber,
        email,
        userType: 'requester',
        firstTimePasswordChanged: true,
        avatar,
      });

      const { encryptedPassword } = userService.encryptPassword().generateToken(newUser).getValues();
      newUser.password = encryptedPassword;
      const user = await newUser.save();
      const emailService = new EmailService(newUser.email, 'Kathēkon: Thank you for registering');
      const emailData = {
        frontendURL: process.env.FRONTEND_URL,
        firstName: user.firstName,
        supportEmail: process.env.SUPPORT_EMAIL,
      };
      await emailService.sendEmail('registration', emailData);
      // possibly send verification email here.

      return ServerUtility.successResponse(
        res,
        201,
        {
          firstName, lastName, email, phoneNumber
        },
        'Registration successful! Thank you for signing up to use Kathēkon',
        { responseTime: `${new Date() - start}ms` }
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description - implements user login method
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @memberof AuthController
   * @returns {object|function} - returns a response object
   */
  static async login(req, res, next) {
    try {
      const start = new Date();
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return ServerUtility.errorResponse(
          res,
          400,
          { message: 'A user with the email and password combination was not found' },
          'User not found',
          {},
          { responseTime: `${new Date() - start}ms`, errorType: '000', errorDescription: errorTypeMap['000'] },
        );
      }

      const userService = new UserService(existingUser.email, password);
      const userPasswordMatch = userService.decryptPassword(existingUser.password);

      if (!userPasswordMatch) {
        return ServerUtility.errorResponse(
          res,
          400,
          { message: 'A user with the email and password combination was not found' },
          'User not found',
          {},
          { responseTime: `${new Date() - start}ms`, errorType: '000', errorDescription: errorTypeMap['000'] },
        );
      }

      const { token } = userService.generateToken(existingUser).getValues();

      return ServerUtility.successResponse(
        res,
        200,
        { token },
        // eslint-disable-next-line max-len
        `User logged in successfully.${existingUser.userType !== 'requester' && !existingUser.firstTimePasswordChanged ? ' We noticed you have not changed your password. Please do so to secure your account.' : ''}`,
        { responseTime: `${new Date() - start}ms` },
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description - implements user password change while logged in
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @memberof AuthController
   * @returns {object|function} - returns a response object
   */
  static async changePasswordAuthorized(req, res, next) {
    try {
      const start = new Date();
      const { newPassword, confirmNewPassword } = req.body;

      const user = await User.findOne({ _id: req.user._id });
      const userService = new UserService(req.user.email, newPassword, req.user.userName);

      const genericPasswords = ['Password123', 'Qwerty123', 'Password1'];

      if (genericPasswords.includes(newPassword)) {
        return ServerUtility.errorResponse(
          res,
          400,
          { newPassword: 'Do not use a common password as your new password' },
          'Validation Error',
          {},
          { responseTime: `${new Date() - start}ms`, errorType: '001', errorDescription: errorTypeMap['001'] },
        );
      }

      if (newPassword !== confirmNewPassword) {
        return ServerUtility.errorResponse(
          res,
          400,
          { message: 'Passwords must match' },
          'Invalid Credentials',
          {},
          { responseTime: `${new Date() - start}ms`, errorType: '000', errorDescription: errorTypeMap['000'] },
        );
      }

      const { encryptedPassword, token } = userService.encryptPassword().generateToken(user).getValues();
      user.password = encryptedPassword;

      await user.save();

      return ServerUtility.successResponse(
        res,
        200,
        { token },
        // eslint-disable-next-line max-len
        'You have successfully changed your password',
        { responseTime: `${new Date() - start}ms` },
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default AuthController;
