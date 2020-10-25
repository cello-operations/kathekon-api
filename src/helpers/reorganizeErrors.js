const reorganizeValidationErrors = (errors) => {
  const allErrorsObject = {};
  // eslint-disable-next-line no-return-assign
  errors.map((errorObject) => allErrorsObject[errorObject.path[0]] = errorObject.message);
  return allErrorsObject;
};

export const errorTypeMap = {
  '000': 'Invalid Credentials',
  '001': 'Validation Error',
  '011': 'Unknown Error',
  100: 'Resource Missing or Deleted',
  101: 'Insufficient Permissions',
};

export default reorganizeValidationErrors;
