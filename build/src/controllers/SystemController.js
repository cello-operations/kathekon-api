"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @description implements system controller class
 * */
var SystemController = /*#__PURE__*/function () {
  function SystemController() {
    _classCallCheck(this, SystemController);
  }

  _createClass(SystemController, null, [{
    key: "getAllLogs",

    /**
     * @description - implements getting server access general logs
     * @param {object} req - request object
     * @param {object} res - response object
     * @param {function} next - next function
     * @memberof AuthController
     * @returns {object|function} - returns a response object
     */
    value: function () {
      var _getAllLogs = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
        var fileName, readStream;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                fileName = _path["default"].resolve('./logs/all-kathekon-logs.log');
                readStream = _fs["default"].createReadStream(fileName);
                readStream.on('open', function () {
                  readStream.pipe(res);
                });
                readStream.on('end', function () {
                  return res.end();
                });
                readStream.on('error', function (err) {
                  res.end(err);
                });
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", next(_context.t0));

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 8]]);
      }));

      function getAllLogs(_x, _x2, _x3) {
        return _getAllLogs.apply(this, arguments);
      }

      return getAllLogs;
    }()
    /**
     * @description - implements getting server error logs
     * @param {object} req - request object
     * @param {object} res - response object
     * @param {function} next - next function
     * @memberof AuthController
     * @returns {object|function} - returns a response object
     */

  }, {
    key: "getAllErrorLogs",
    value: function () {
      var _getAllErrorLogs = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
        var fileName, readStream;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                fileName = _path["default"].resolve('./logs/kathekon-error-logs.log');
                readStream = _fs["default"].createReadStream(fileName);
                readStream.on('open', function () {
                  readStream.pipe(res);
                });
                readStream.on('end', function () {
                  return res.end();
                });
                readStream.on('error', function (err) {
                  res.end(err);
                });
                _context2.next = 11;
                break;

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](0);
                return _context2.abrupt("return", next(_context2.t0));

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 8]]);
      }));

      function getAllErrorLogs(_x4, _x5, _x6) {
        return _getAllErrorLogs.apply(this, arguments);
      }

      return getAllErrorLogs;
    }()
  }]);

  return SystemController;
}();

var _default = SystemController;
exports["default"] = _default;