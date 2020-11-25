"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.errorTypeMap = void 0;

var reorganizeValidationErrors = function reorganizeValidationErrors(errors) {
  var allErrorsObject = {}; // eslint-disable-next-line no-return-assign

  errors.map(function (errorObject) {
    return allErrorsObject[errorObject.path[0]] = errorObject.message;
  });
  return allErrorsObject;
};

var errorTypeMap = {
  '000': 'Invalid Credentials',
  '001': 'Validation Error',
  '011': 'Unknown Error',
  100: 'Resource Missing or Deleted',
  101: 'Insufficient Permissions'
};
exports.errorTypeMap = errorTypeMap;
var _default = reorganizeValidationErrors;
exports["default"] = _default;