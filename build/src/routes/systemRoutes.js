"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _SystemController = _interopRequireDefault(require("../controllers/SystemController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var systemRouter = (0, _express.Router)();
systemRouter.get('/logs', _SystemController["default"].getAllLogs);
systemRouter.get('/error-logs', _SystemController["default"].getAllErrorLogs);
var _default = systemRouter;
exports["default"] = _default;