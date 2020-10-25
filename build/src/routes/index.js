"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _ServerResponse = _interopRequireDefault(require("../helpers/ServerResponse"));

var _authRoutes = _interopRequireDefault(require("./authRoutes"));

var _systemRoutes = _interopRequireDefault(require("./systemRoutes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)();
router.get('/', function (req, res) {
  var start = new Date();
  return _ServerResponse["default"].successResponse(res, 200, {
    apiVersion: 1
  }, 'Kathekon API Version 1', {
    responseTime: "".concat(new Date() - start, "ms")
  });
});
router.use('/auth', _authRoutes["default"]);
router.use('/system', _systemRoutes["default"]);
var _default = router;
exports["default"] = _default;