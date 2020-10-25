"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _passportJwt = require("passport-jwt");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_dotenv["default"].config();

var options = {};
options.jwtFromRequest = _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.JWT_SECRET;

var passportConfig = function passportConfig(passport) {
  return passport.use(new _passportJwt.Strategy(options, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, done) {
      var id, user;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              id = _ref.id;
              _context.prev = 1;
              _context.next = 4;
              return _User["default"].findOne({
                id: id
              });

            case 4:
              user = _context.sent;

              if (!user) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", done(null, user));

            case 7:
              return _context.abrupt("return", done(null, false));

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](1);
              throw new Error(_context.t0);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 10]]);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }()));
};

var _default = passportConfig;
exports["default"] = _default;