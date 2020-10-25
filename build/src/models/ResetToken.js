"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var resetTokenSchema = new _mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  blacklisted: {
    type: Boolean,
    "default": false
  },
  userId: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  createdOn: {
    type: Date,
    "default": Date.now()
  },
  expiresIn: {
    type: Date
  }
});
var ResetToken = (0, _mongoose.model)('resetTokens', resetTokenSchema);
var _default = ResetToken;
exports["default"] = _default;