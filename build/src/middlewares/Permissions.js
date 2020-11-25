"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _passport = _interopRequireDefault(require("passport"));

var _ServerResponse = _interopRequireDefault(require("../helpers/ServerResponse"));

var _UserService = _interopRequireDefault(require("../services/UserService"));

var _reorganizeErrors = require("../helpers/reorganizeErrors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @description implements permissions class for user actions
 */
var Permissions = /*#__PURE__*/function () {
  function Permissions() {
    _classCallCheck(this, Permissions);
  }

  _createClass(Permissions, null, [{
    key: "authenticateJWTFromRequest",

    /**
     * @description - implements JWT authentication for protected routes
     * @param {object} req - request object
     * @param {object} res - response object
     * @memberof Permissions
     * @returns {object|function} - returns the response object if there's a failure and the next function on success
     */
    value: function authenticateJWTFromRequest(req, res, next) {
      var start = new Date(); // eslint-disable-next-line no-unused-vars

      _passport["default"].authenticate('jwt', function (error, user, info) {
        if (error) {
          return next(error);
        }

        if (!user) {
          return _ServerResponse["default"].errorResponse(res, 401, {
            message: 'Unauthorized access, please check credentials and try again'
          }, 'Invalid credentials', {}, {
            errorType: '000',
            responseTime: "".concat(new Date() - start, "ms"),
            errorDescription: _reorganizeErrors.errorTypeMap['000']
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

  }, {
    key: "allowOnly",
    value: function allowOnly(allowedUsers) {
      var start = new Date();
      return function (req, res, next) {
        var userType = req.user.userType;

        if (allowedUsers.includes(userType)) {
          return next();
        }

        return _ServerResponse["default"].errorResponse(res, 403, {
          message: 'You are not allowed to do that'
        }, 'Unauthorized action', {
          errorType: '101',
          responseTime: "".concat(new Date() - start, "ms"),
          errorDescription: _reorganizeErrors.errorTypeMap['101']
        });
      };
    }
    /**
     * @description - implements password check for old password when changing a password
     * @param {object} req - request object
     * @param {object} res - response object
     * @memberof Permissions
     * @returns {object|function} - returns the response object if there's a failure and the next function on success
     */

  }, {
    key: "checkPassword",
    value: function checkPassword(req, res, next) {
      var start = new Date();
      var oldPassword = req.body.oldPassword;

      if (!oldPassword) {
        return _ServerResponse["default"].errorResponse(res, 400, {
          message: 'Please provide current password'
        }, 'Invalid credentials', {}, {
          errorType: '000',
          responseTime: "".concat(new Date() - start, "ms"),
          errorDescription: _reorganizeErrors.errorTypeMap['000']
        });
      }

      var userPasswordMatch = _UserService["default"].comparePasswords(oldPassword, req.user.password);

      if (!userPasswordMatch) {
        return _ServerResponse["default"].errorResponse(res, 401, {
          message: 'Please enter the correct password and try again'
        }, 'Invalid credentials', {}, {
          errorType: '000',
          responseTime: "".concat(new Date() - start, "ms"),
          errorDescription: _reorganizeErrors.errorTypeMap['000']
        });
      }

      return next();
    }
  }]);

  return Permissions;
}();

var _default = Permissions;
exports["default"] = _default;