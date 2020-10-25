"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _ejs = _interopRequireDefault(require("ejs"));

var _path = _interopRequireDefault(require("path"));

var _logger = _interopRequireDefault(require("../helpers/logger"));

var _EmailConfig = _interopRequireDefault(require("../config/EmailConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_dotenv["default"].config();

var EmailService = /*#__PURE__*/function () {
  function EmailService(receiver, subject) {
    var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, EmailService);

    this.receiver = receiver;
    this.subject = subject;
    this.content = content;
    this.transport = _EmailConfig["default"];
  }

  _createClass(EmailService, [{
    key: "sendEmail",
    value: function () {
      var _sendEmail = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(template, templateData) {
        var _this = this;

        var file;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // Get the EJS file that will be used to generate the HTML
                file = _path["default"].join(__dirname, "../views/".concat(template, ".ejs")); // if file is not found

                if (file) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return", _logger["default"].error("Could not find the ".concat(template, " in path ").concat(file)));

              case 3:
                return _context2.abrupt("return", _ejs["default"].renderFile(file, templateData, /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(error, html) {
                    var emailOptions;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (!error) {
                              _context.next = 3;
                              break;
                            }

                            _logger["default"].error(error);

                            throw new Error(error);

                          case 3:
                            _this.content = html;
                            emailOptions = {
                              to: _this.receiver,
                              subject: _this.subject,
                              html: _this.content,
                              from: 'Kathekon'
                            };
                            _context.next = 7;
                            return _this.transport.sendMail(emailOptions, function (err, info) {
                              if (error) {
                                _logger["default"].error(err);
                              }

                              _logger["default"].info(info);
                            });

                          case 7:
                            return _context.abrupt("return", html);

                          case 8:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x3, _x4) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function sendEmail(_x, _x2) {
        return _sendEmail.apply(this, arguments);
      }

      return sendEmail;
    }()
  }]);

  return EmailService;
}();

var _default = EmailService;
exports["default"] = _default;