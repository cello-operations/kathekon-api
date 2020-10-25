import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Debug from 'debug';

import logger from '../helpers/logger';

dotenv.config();

const debugEnv = process.env.NODE_ENV !== 'production' ? 'development' : 'production';
const debug = Debug(debugEnv);

mongoose.connection.on('error', (err) => {
  logger.log({
    level: 'error',
    error: err,
  });
  debug(`Mongoose connection error occured: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  debug('Database connection terminated');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    debug('Mongoose disconnecting due to interruption event');
    process.exit(0);
  });
});

async function connectToDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    return debug('Database connection established');
  } catch (error) {
    debug(error);
    throw new Error(error);
  }
}

export default connectToDB;
