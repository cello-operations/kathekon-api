"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var userSchema = new _mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enun: ['requester', 'superAdmin', 'admin']
  },
  isVerified: {
    type: Boolean,
    "default": false
  },
  createdOn: {
    type: Date,
    "default": Date.now
  },
  updatedOn: {
    type: Date,
    "default": Date.now
  },
  defaultPass: {
    type: String
  },
  firstTimePasswordChanged: {
    type: Boolean,
    "default": false
  }
});
userSchema.index({
  firstName: 'text',
  lastName: 'text'
});
var User = (0, _mongoose.model)('users', userSchema);
var _default = User;
exports["default"] = _default;