"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gravatar = _interopRequireDefault(require("gravatar"));

var _bcryptjs = require("bcryptjs");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cryptoRandomString = _interopRequireDefault(require("crypto-random-string"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_dotenv["default"].config();

var UserService = /*#__PURE__*/function () {
  function UserService(email, password) {
    _classCallCheck(this, UserService);

    this.email = email;
    this.password = password;
    this.avatar = '';
    this.token = '';
    this.verificationToken = '';
  }

  _createClass(UserService, [{
    key: "getValues",
    value: function getValues() {
      return {
        email: this.email,
        encryptedPassword: this.password,
        token: this.token,
        verificationToken: this.verificationToken
      };
    }
  }, {
    key: "generateDefaultAvatar",
    value: function generateDefaultAvatar() {
      this.avatar = _gravatar["default"].url(this.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      return this.avatar;
    }
  }, {
    key: "encryptPassword",
    value: function encryptPassword() {
      this.password = (0, _bcryptjs.hashSync)(this.password, 10);
      this.verificationToken = (0, _cryptoRandomString["default"])({
        length: 20,
        type: 'url-safe'
      });
      return this;
    }
  }, {
    key: "generateToken",
    value: function generateToken(_ref) {
      var _id = _ref._id,
          id = _ref.id,
          email = _ref.email,
          isVerified = _ref.isVerified,
          firstTimePasswordChanged = _ref.firstTimePasswordChanged,
          firstName = _ref.firstName,
          lastName = _ref.lastName,
          avatar = _ref.avatar,
          createdOn = _ref.createdOn,
          updatedOn = _ref.updatedOn;
      var JWT_SECRET = process.env.JWT_SECRET;
      var payload = {
        _id: _id,
        id: id,
        email: email,
        isVerified: isVerified,
        firstTimePasswordChanged: firstTimePasswordChanged,
        firstName: firstName,
        lastName: lastName,
        avatar: avatar,
        createdOn: createdOn,
        updatedOn: updatedOn
      };

      var token = _jsonwebtoken["default"].sign(payload, JWT_SECRET, {
        expiresIn: '24h'
      });

      this.token = token;
      return this;
    }
  }, {
    key: "decryptPassword",
    value: function decryptPassword(encryptedPassword) {
      return (0, _bcryptjs.compareSync)(this.password, encryptedPassword);
    }
  }], [{
    key: "comparePasswords",
    value: function comparePasswords(password, encryptedPassword) {
      return (0, _bcryptjs.compareSync)(password, encryptedPassword);
    }
  }]);

  return UserService;
}();

var _default = UserService;
exports["default"] = _default;