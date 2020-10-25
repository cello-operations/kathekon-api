import 'core-js';
import 'regenerator-runtime';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import passport from 'passport';
import ResponseTime from 'response-time';

import v1Router from './src/routes';
import logger from './src/helpers/logger';
import ServerUtility from './src/helpers/ServerResponse';
import connectToDB from './src/database';
import passportConfig from './src/config/passportConfig';

const httpLogger = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]',
  { stream: logger.stream },
);

const API_V1_PREFIX = '/api/v1';
const app = express();
const PORT = process.env.PORT || 1010;

const inProduction = process.env.NODE_ENV === 'production';

// security configuration
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(ResponseTime());
app.use(httpLogger);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(API_V1_PREFIX, v1Router);
passportConfig(passport);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(ServerUtility.error404);

if (!inProduction) {
  app.use(ServerUtility.serverErrorWithStackTrace);
} else {
  app.use(ServerUtility.safeServerError);
}

(async () => {
  try {
    await connectToDB();
  } catch (error) {
    logger.error(error);
  }
})();

app.listen(PORT, () => {
  logger.info(`Server listening on PORT:${PORT}`);
});

const safeServerShutDown = () => {
  logger.info('Stopping server due to an interruption');
  logger.info('Now closing server...');
  process.exit(0);
};

process.on('SIGINT', safeServerShutDown);

if (process.platform === 'win32') {
  // eslint-disable-next-line global-require
  require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  }).on('SIGINT', () => {
    process.emit('SIGINT');
  });
}
