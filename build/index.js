"use strict";

require("core-js");

require("regenerator-runtime");

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _helmet = _interopRequireDefault(require("helmet"));

var _path = _interopRequireDefault(require("path"));

var _passport = _interopRequireDefault(require("passport"));

var _responseTime = _interopRequireDefault(require("response-time"));

var _routes = _interopRequireDefault(require("./src/routes"));

var _logger = _interopRequireDefault(require("./src/helpers/logger"));

var _ServerResponse = _interopRequireDefault(require("./src/helpers/ServerResponse"));

var _database = _interopRequireDefault(require("./src/database"));

var _passportConfig = _interopRequireDefault(require("./src/config/passportConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var httpLogger = (0, _morgan["default"])(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]', {
  stream: _logger["default"].stream
});
var API_V1_PREFIX = '/api/v1';
var app = (0, _express["default"])();
var PORT = process.env.PORT || 1010;
var inProduction = process.env.NODE_ENV === 'production'; // security configuration

app.use((0, _helmet["default"])());
app.use(_helmet["default"].hidePoweredBy({
  setTo: 'PHP 4.2.0'
}));
app.use((0, _responseTime["default"])());
app.use(httpLogger);
app.use(_express["default"].json({
  limit: '15mb'
}));
app.use(_express["default"].urlencoded({
  extended: true
}));
app.set('views', _path["default"].join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(_passport["default"].initialize());
app.use(API_V1_PREFIX, _routes["default"]);
(0, _passportConfig["default"])(_passport["default"]);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
app.use(_ServerResponse["default"].error404);

if (!inProduction) {
  app.use(_ServerResponse["default"].serverErrorWithStackTrace);
} else {
  app.use(_ServerResponse["default"].safeServerError);
}

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return (0, _database["default"])();

        case 3:
          _context.next = 8;
          break;

        case 5:
          _context.prev = 5;
          _context.t0 = _context["catch"](0);

          _logger["default"].error(_context.t0);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, null, [[0, 5]]);
}))();

app.listen(PORT, function () {
  _logger["default"].info("Server listening on PORT:".concat(PORT));
});

var safeServerShutDown = function safeServerShutDown() {
  _logger["default"].info('Stopping server due to an interruption');

  _logger["default"].info('Now closing server...');

  process.exit(0);
};

process.on('SIGINT', safeServerShutDown);

if (process.platform === 'win32') {
  // eslint-disable-next-line global-require
  require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  }).on('SIGINT', function () {
    process.emit('SIGINT');
  });
}