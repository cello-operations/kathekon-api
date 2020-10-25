"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _AuthController = _interopRequireDefault(require("../controllers/AuthController"));

var _AuthValidator = _interopRequireDefault(require("../validators/AuthValidator"));

var _Permissions = _interopRequireDefault(require("../middlewares/Permissions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)();
router.post('/register', _AuthValidator["default"].validateRegistration, _AuthController["default"].registerUser);
router.post('/login', _AuthValidator["default"].validateLogin, _AuthController["default"].login);
router.patch('/change-password', _Permissions["default"].authenticateJWTFromRequest, _Permissions["default"].checkPassword, _AuthValidator["default"].validatePasswordChangeAuthorized, _AuthController["default"].changePasswordAuthorized);
var _default = router;
exports["default"] = _default;