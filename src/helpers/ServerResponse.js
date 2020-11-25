/* eslint-disable class-methods-use-this */
import Debug from 'debug';
import logger from './logger';
import { errorTypeMap } from './reorganizeErrors';

const debug = Debug('development');

class ServerResponse {
  constructor() {
    this.debugger = debug;
  }

  successResponse(res, statusCode, data, message = null, meta = {}) {
    return res.status(statusCode).json({
      status: 'success',
      meta: {
        errored: false,
        ...meta,
      },
      message,
      data,
    });
  }

  errorResponse(res, statusCode, error, message = null, data = null, meta = null) {
    return res.status(statusCode).json({
      status: 'error',
      error,
      message,
      data,
      meta: {
        errored: true,
        ...meta,
      },
    });
  }

  error404(req, res) {
    return res.status(404).json({
      status: 'error',
      error: {
        message: 'Resource not found',
      },
      message: 'The requested resorce is not available',
      data: null,
      meta: {
        errored: true,
        errorType: 100,
        errorDescription: errorTypeMap['100'],
      },
    });
  }

  safeServerError(err, req, res, next) {
    const { ...otherBodyData } = req.body;
    logger.log({
      level: 'error',
      method: req.method,
      url: req.url,
      clientInfo: req.headers['user-agent'],
      user: req.user ? req.user.id : {},
      requestData: req.body.data ? { dataLength: req.body.data.length } : otherBodyData,
      status: res.statusCode,
      statusMessage: res.message,
      error: err.stack,
    });
    return res.status(500).json({
      status: 'status',
      error: {
        message: 'Something went wrong!',
      },
      meta: {
        errored: true,
        errorType: '011',
        errorDescription: errorTypeMap['011'],
      },
      data: null,
      message: 'Something went wrong while we were processing your request. This could be due to a netwrok issue or configuration mismatch',
    });
  }

  serverErrorWithStackTrace(err, req, res, next) {
    logger.log({
      level: 'error',
      method: req.method,
      url: req.url,
      clientInfo: req.headers['user-agent'],
      status: res.statusCode,
      statusMessage: res.message,
      error: err.stack,
    });
    return res.status(err.status || 500).json({
      status: 'error',
      error: {
        message: `${err.message}, Check console for more details`,
      },
      meta: {
        errored: true,
        errorType: '011',
        errorDescription: errorTypeMap['011'],
      },
      data: err,
      message: `${err.message}, Check console for more details`,
    });
  }
}

const ServerUtility = new ServerResponse();

export default ServerUtility;
