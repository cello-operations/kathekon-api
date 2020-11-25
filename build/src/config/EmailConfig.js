"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _googleapis = require("googleapis");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_dotenv["default"].config();

var _console = console,
    log = _console.log;
var OAuth2 = _googleapis.google.auth.OAuth2;
var OAuth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_OAUTH2_SECRET, process.env.REDIRECT_URL);
OAuth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN
});

var getAccessToken = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return OAuth2Client.getAccessToken();

          case 3:
            accessToken = _context.sent;
            return _context.abrupt("return", accessToken.token);

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            throw new Error('Error while getting smtp access token');

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function getAccessToken() {
    return _ref.apply(this, arguments);
  };
}();

var transport = _nodemailer["default"].createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.SMTP_USERNAME,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH2_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    accessToken: getAccessToken().then(function (t) {
      return t;
    })
  },
  tls: {
    rejectUnauthorized: false
  }
});

transport.verify(function (error) {
  if (error) {
    log(error);
  } else {
    log('Server is ready to take our messages');
  }
});
var _default = transport;
exports["default"] = _default;