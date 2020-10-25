"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _debug = _interopRequireDefault(require("debug"));

var _logger = _interopRequireDefault(require("./logger"));

var _reorganizeErrors = require("./reorganizeErrors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var debug = (0, _debug["default"])('development');
var inProduction = process.env.NODE_ENV === 'production';

var ServerResponse = /*#__PURE__*/function () {
  function ServerResponse(customLogger) {
    _classCallCheck(this, ServerResponse);

    this.logger = customLogger;
    this["debugger"] = debug;
  }

  _createClass(ServerResponse, [{
    key: "successResponse",
    value: function successResponse(res, statusCode, data) {
      var message = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var meta = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      return res.status(statusCode).json({
        status: 'success',
        meta: _objectSpread({
          errored: false
        }, meta),
        message: message,
        data: data
      });
    }
  }, {
    key: "errorResponse",
    value: function errorResponse(res, statusCode, error) {
      var message = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var data = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var meta = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
      return res.status(statusCode).json({
        status: 'error',
        error: error,
        message: message,
        data: data,
        meta: _objectSpread({
          errored: true
        }, meta)
      });
    }
  }, {
    key: "error404",
    value: function error404(req, res) {
      return res.status(404).json({
        status: 'error',
        error: {
          message: 'Resource not found'
        },
        message: 'The requested resorce is not available',
        data: null,
        meta: {
          errored: true,
          errorType: 100,
          errorDescription: _reorganizeErrors.errorTypeMap['100']
        }
      });
    }
  }, {
    key: "safeServerError",
    value: function safeServerError(err, req, res, next) {
      var otherBodyData = _extends({}, req.body);

      this.logger.log({
        level: 'error',
        method: req.method,
        url: req.url,
        clientInfo: req.headers['user-agent'],
        user: req.user ? req.user.id : {},
        requestData: req.body.data ? {
          dataLength: req.body.data.length
        } : otherBodyData,
        status: res.statusCode,
        statusMessage: res.message,
        error: err.stack
      });
      return res.status(500).json({
        status: 'status',
        error: {
          message: 'Something went wrong!'
        },
        meta: {
          errored: true,
          errorType: '011',
          errorDescription: _reorganizeErrors.errorTypeMap['011']
        },
        data: null,
        message: 'Something went wrong while we were processing your request. This could be due to a netwrok issue or configuration mismatch'
      });
    }
  }, {
    key: "serverErrorWithStackTrace",
    value: function serverErrorWithStackTrace(err, req, res, next) {
      debug(err.stack);
      return res.status(err.status || 500).json({
        status: 'error',
        error: {
          message: "".concat(err.message, ", Check console for more details")
        },
        meta: {
          errored: true,
          errorType: '011',
          errorDescription: _reorganizeErrors.errorTypeMap['011']
        },
        data: err,
        message: "".concat(err.message, ", Check console for more details")
      });
    }
  }]);

  return ServerResponse;
}();

var ServerUtility = new ServerResponse(inProduction ? _logger["default"] : debug);
var _default = ServerUtility;
exports["default"] = _default;