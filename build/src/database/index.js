"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _debug = _interopRequireDefault(require("debug"));

var _logger = _interopRequireDefault(require("../helpers/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_dotenv["default"].config();

var debugEnv = process.env.NODE_ENV !== 'production' ? 'development' : 'production';
var debug = (0, _debug["default"])(debugEnv);

_mongoose["default"].connection.on('error', function (err) {
  _logger["default"].log({
    level: 'error',
    error: err
  });

  debug("Mongoose connection error occured: ".concat(err));
});

_mongoose["default"].connection.on('disconnected', function () {
  debug('Database connection terminated');
});

process.on('SIGINT', function () {
  _mongoose["default"].connection.close(function () {
    debug('Mongoose disconnecting due to interruption event');
    process.exit(0);
  });
});

function connectToDB() {
  return _connectToDB.apply(this, arguments);
}

function _connectToDB() {
  _connectToDB = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _mongoose["default"].connect(process.env.DATABASE_URL, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              useCreateIndex: true,
              useFindAndModify: false
            });

          case 3:
            return _context.abrupt("return", debug('Database connection established'));

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);
            debug(_context.t0);
            throw new Error(_context.t0);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 6]]);
  }));
  return _connectToDB.apply(this, arguments);
}

var _default = connectToDB;
exports["default"] = _default;