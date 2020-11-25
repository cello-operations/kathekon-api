"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _winston = require("winston");

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var logger = (0, _winston.createLogger)({
  format: _winston.format.combine(_winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss:ms'
  }), _winston.format.printf(function (info) {
    return "".concat(info.timestamp, " ").concat(info.level, ": ").concat(info.message);
  }), _winston.format.json({})),
  transports: [new _winston.transports.File({
    filename: './logs/all-kathekon-logs.log',
    json: false,
    maxsize: 52442880,
    maxFiles: 3,
    colorize: false
  }), new _winston.transports.File({
    filename: './logs/kathekon-error-logs.log',
    json: true,
    maxsize: 5242880,
    maxFiles: 5,
    level: 'error',
    colorize: false
  })]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new _winston.transports.Console({
    format: _winston.format.simple(),
    level: 'debug',
    json: false
  }));
}

logger.stream = {
  write: function write(message) {
    return logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
};
var _default = logger;
exports["default"] = _default;