import fs from 'fs';
import path from 'path';

/**
 * @description implements system controller class
 * */
class SystemController {
  /**
   * @description - implements getting server access general logs
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @memberof AuthController
   * @returns {object|function} - returns a response object
   */
  static async getAllLogs(req, res, next) {
    try {
      const fileName = path.resolve('./logs/all-kathekon-logs.log');
      const readStream = fs.createReadStream(fileName);
      readStream.on('open', () => {
        readStream.pipe(res);
      });
      readStream.on('end', () => res.end());
      readStream.on('error', (err) => {
        res.end(err);
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description - implements getting server error logs
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - next function
   * @memberof AuthController
   * @returns {object|function} - returns a response object
   */
  static async getAllErrorLogs(req, res, next) {
    try {
      const fileName = path.resolve('./logs/kathekon-error-logs.log');
      const readStream = fs.createReadStream(fileName);
      readStream.on('open', () => {
        readStream.pipe(res);
      });
      readStream.on('end', () => res.end());
      readStream.on('error', (err) => {
        res.end(err);
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default SystemController;
