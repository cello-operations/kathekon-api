"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _uuid = require("uuid");

var _User = _interopRequireDefault(require("../models/User"));

var _UserService = _interopRequireDefault(require("../services/UserService"));

var _EmailService = _interopRequireDefault(require("../services/EmailService"));

var _ServerResponse = _interopRequireDefault(require("../helpers/ServerResponse"));

var _reorganizeErrors = require("../helpers/reorganizeErrors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @description implements Authentication Controller
*/
var AuthController = /*#__PURE__*/function () {
  function AuthController() {
    _classCallCheck(this, AuthController);
  }

  _createClass(AuthController, null, [{
    key: "registerUser",

    /**
     * @description - implements user registration method
     * @param {object} req - request object
     * @param {object} res - response object
     * @param {function} next - next function
     * @memberof AuthController
     * @returns {object|function} - returns a response object
     */
    value: function () {
      var _registerUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
        var start, _req$body, firstName, lastName, email, password, phoneNumber, existingUser, userService, avatar, newUser, _userService$encryptP, encryptedPassword, user, emailService, emailData;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                start = new Date();
                _req$body = req.body, firstName = _req$body.firstName, lastName = _req$body.lastName, email = _req$body.email, password = _req$body.password, phoneNumber = _req$body.phoneNumber; // check if user already exists

                _context.next = 5;
                return _User["default"].findOne({
                  $or: [{
                    email: email
                  }, {
                    phoneNumber: phoneNumber
                  }]
                });

              case 5:
                existingUser = _context.sent;

                if (!existingUser) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return", _ServerResponse["default"].errorResponse(res, 409, {
                  message: 'A user with that email or phone number exists'
                }, 'A user with that email or phone number exists', {}, {
                  responseTime: "".concat(new Date() - start, "ms"),
                  errorType: '000',
                  errorDescription: _reorganizeErrors.errorTypeMap['000']
                }));

              case 8:
                userService = new _UserService["default"](email, password);
                avatar = userService.generateDefaultAvatar();
                newUser = new _User["default"]({
                  id: (0, _uuid.v4)(),
                  firstName: firstName,
                  lastName: lastName,
                  phoneNumber: phoneNumber,
                  email: email,
                  userType: 'requester',
                  firstTimePasswordChanged: true,
                  avatar: avatar
                });
                _userService$encryptP = userService.encryptPassword().generateToken(newUser).getValues(), encryptedPassword = _userService$encryptP.encryptedPassword;
                newUser.password = encryptedPassword;
                _context.next = 15;
                return newUser.save();

              case 15:
                user = _context.sent;
                emailService = new _EmailService["default"](newUser.email, 'Kathēkon: Thank you for registering');
                emailData = {
                  frontendURL: process.env.FRONTEND_URL,
                  firstName: user.firstName,
                  supportEmail: process.env.SUPPORT_EMAIL
                };
                _context.next = 20;
                return emailService.sendEmail('registration', emailData);

              case 20:
                return _context.abrupt("return", _ServerResponse["default"].successResponse(res, 201, {
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  phoneNumber: phoneNumber
                }, 'Registration successful! Thank you for signing up to use Kathēkon', {
                  responseTime: "".concat(new Date() - start, "ms")
                }));

              case 23:
                _context.prev = 23;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", next(_context.t0));

              case 26:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 23]]);
      }));

      function registerUser(_x, _x2, _x3) {
        return _registerUser.apply(this, arguments);
      }

      return registerUser;
    }()
    /**
     * @description - implements user login method
     * @param {object} req - request object
     * @param {object} res - response object
     * @param {function} next - next function
     * @memberof AuthController
     * @returns {object|function} - returns a response object
     */

  }, {
    key: "login",
    value: function () {
      var _login = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
        var start, _req$body2, email, password, existingUser, userService, userPasswordMatch, _userService$generate, token;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                start = new Date();
                _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
                _context2.next = 5;
                return _User["default"].findOne({
                  email: email
                });

              case 5:
                existingUser = _context2.sent;

                if (existingUser) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return", _ServerResponse["default"].errorResponse(res, 400, {
                  message: 'A user with the email and password combination was not found'
                }, 'User not found', {}, {
                  responseTime: "".concat(new Date() - start, "ms"),
                  errorType: '000',
                  errorDescription: _reorganizeErrors.errorTypeMap['000']
                }));

              case 8:
                userService = new _UserService["default"](existingUser.email, password);
                userPasswordMatch = userService.decryptPassword(existingUser.password);

                if (userPasswordMatch) {
                  _context2.next = 12;
                  break;
                }

                return _context2.abrupt("return", _ServerResponse["default"].errorResponse(res, 400, {
                  message: 'A user with the email and password combination was not found'
                }, 'User not found', {}, {
                  responseTime: "".concat(new Date() - start, "ms"),
                  errorType: '000',
                  errorDescription: _reorganizeErrors.errorTypeMap['000']
                }));

              case 12:
                _userService$generate = userService.generateToken(existingUser).getValues(), token = _userService$generate.token;
                return _context2.abrupt("return", _ServerResponse["default"].successResponse(res, 200, {
                  token: token
                }, // eslint-disable-next-line max-len
                "User logged in successfully.".concat(existingUser.userType !== 'requester' && !existingUser.firstTimePasswordChanged ? ' We noticed you have not changed your password. Please do so to secure your account.' : ''), {
                  responseTime: "".concat(new Date() - start, "ms")
                }));

              case 16:
                _context2.prev = 16;
                _context2.t0 = _context2["catch"](0);
                return _context2.abrupt("return", next(_context2.t0));

              case 19:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 16]]);
      }));

      function login(_x4, _x5, _x6) {
        return _login.apply(this, arguments);
      }

      return login;
    }()
    /**
     * @description - implements user password change while logged in
     * @param {object} req - request object
     * @param {object} res - response object
     * @param {function} next - next function
     * @memberof AuthController
     * @returns {object|function} - returns a response object
     */

  }, {
    key: "changePasswordAuthorized",
    value: function () {
      var _changePasswordAuthorized = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
        var start, _req$body3, newPassword, confirmNewPassword, user, userService, genericPasswords, _userService$encryptP2, encryptedPassword, token;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                start = new Date();
                _req$body3 = req.body, newPassword = _req$body3.newPassword, confirmNewPassword = _req$body3.confirmNewPassword;
                _context3.next = 5;
                return _User["default"].findOne({
                  _id: req.user._id
                });

              case 5:
                user = _context3.sent;
                userService = new _UserService["default"](req.user.email, newPassword, req.user.userName);
                genericPasswords = ['Password123', 'Qwerty123', 'Password1'];

                if (!genericPasswords.includes(newPassword)) {
                  _context3.next = 10;
                  break;
                }

                return _context3.abrupt("return", _ServerResponse["default"].errorResponse(res, 400, {
                  newPassword: 'Do not use a common password as your new password'
                }, 'Validation Error', {}, {
                  responseTime: "".concat(new Date() - start, "ms"),
                  errorType: '001',
                  errorDescription: _reorganizeErrors.errorTypeMap['001']
                }));

              case 10:
                if (!(newPassword !== confirmNewPassword)) {
                  _context3.next = 12;
                  break;
                }

                return _context3.abrupt("return", _ServerResponse["default"].errorResponse(res, 400, {
                  message: 'Passwords must match'
                }, 'Invalid Credentials', {}, {
                  responseTime: "".concat(new Date() - start, "ms"),
                  errorType: '000',
                  errorDescription: _reorganizeErrors.errorTypeMap['000']
                }));

              case 12:
                _userService$encryptP2 = userService.encryptPassword().generateToken(user).getValues(), encryptedPassword = _userService$encryptP2.encryptedPassword, token = _userService$encryptP2.token;
                user.password = encryptedPassword;
                _context3.next = 16;
                return user.save();

              case 16:
                return _context3.abrupt("return", _ServerResponse["default"].successResponse(res, 200, {
                  token: token
                }, // eslint-disable-next-line max-len
                'You have successfully changed your password', {
                  responseTime: "".concat(new Date() - start, "ms")
                }));

              case 19:
                _context3.prev = 19;
                _context3.t0 = _context3["catch"](0);
                return _context3.abrupt("return", next(_context3.t0));

              case 22:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 19]]);
      }));

      function changePasswordAuthorized(_x7, _x8, _x9) {
        return _changePasswordAuthorized.apply(this, arguments);
      }

      return changePasswordAuthorized;
    }()
  }]);

  return AuthController;
}();

var _default = AuthController;
exports["default"] = _default;