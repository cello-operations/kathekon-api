"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _ServerResponse = _interopRequireDefault(require("../helpers/ServerResponse"));

var _reorganizeErrors = _interopRequireWildcard(require("../helpers/reorganizeErrors"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @description implements Auth Validator class
 */
var AuthValidator = /*#__PURE__*/function () {
  function AuthValidator() {
    _classCallCheck(this, AuthValidator);
  }

  _createClass(AuthValidator, null, [{
    key: "validateRegistration",

    /**
     * @description - implements registration request body validator
     * @param {object} req - request object
     * @param {object} res - response object
     * @return {object|function} - returns a response object if validation fails or a function if it passess
     */
    value: function validateRegistration(req, res, next) {
      var start = new Date();

      var schema = _joi["default"].object().keys({
        firstName: _joi["default"].string().required(),
        lastName: _joi["default"].string().required(),
        email: _joi["default"].string().email().required(),
        password: _joi["default"].string().required(),
        phoneNumber: _joi["default"].string()
      });

      var _schema$validate = schema.validate(req.body, {
        abortEarly: false
      }),
          error = _schema$validate.error;

      if (error) {
        var errorMessages = (0, _reorganizeErrors["default"])(error.details);
        return _ServerResponse["default"].errorResponse(res, 400, errorMessages, 'Validation error', {}, {
          errorType: '001',
          responseTime: "".concat(new Date() - start, "ms"),
          errorDescription: _reorganizeErrors.errorTypeMap['001']
        });
      }

      return next();
    }
    /**
     * @description - implements login request body validator
     * @param {object} req - request object
     * @param {object} res - response object
     * @return {object|function} - returns a response object if validation fails or a function if it passess
     */

  }, {
    key: "validateLogin",
    value: function validateLogin(req, res, next) {
      var start = new Date();

      var schema = _joi["default"].object().keys({
        email: _joi["default"].string().email().required(),
        password: _joi["default"].string().required()
      });

      var _schema$validate2 = schema.validate(req.body, {
        abortEarly: false
      }),
          error = _schema$validate2.error;

      if (error) {
        var errorMessages = (0, _reorganizeErrors["default"])(error.details);
        return _ServerResponse["default"].errorResponse(res, 400, errorMessages, 'Validation error', {}, {
          errorType: '001',
          responseTime: "".concat(new Date() - start, "ms"),
          errorDescription: _reorganizeErrors.errorTypeMap['001']
        });
      }

      return next();
    }
    /**
     * @description - implements change password request body validator
     * @param {object} req - request object
     * @param {object} res - response object
     * @return {object|function} - returns a response object if validation fails or a function if it passess
     */

  }, {
    key: "validatePasswordChangeAuthorized",
    value: function validatePasswordChangeAuthorized(req, res, next) {
      var start = new Date();

      var schema = _joi["default"].object().keys({
        oldPassword: _joi["default"].string().required(),
        newPassword: _joi["default"].string().alphanum().required(),
        confirmNewPassword: _joi["default"].string().required()
      });

      var _schema$validate3 = schema.validate(req.body, {
        abortEarly: false
      }),
          error = _schema$validate3.error;

      if (error) {
        var errorMessages = (0, _reorganizeErrors["default"])(error.details);
        return _ServerResponse["default"].errorResponse(res, 400, errorMessages, 'Validation error', {}, {
          errorType: '001',
          responseTime: "".concat(new Date() - start, "ms"),
          errorDescription: _reorganizeErrors.errorTypeMap['001']
        });
      }

      return next();
    }
  }]);

  return AuthValidator;
}();

var _default = AuthValidator;
exports["default"] = _default;