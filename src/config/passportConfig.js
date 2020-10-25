import { Strategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';

import User from '../models/User';

dotenv.config();

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.JWT_SECRET;

const passportConfig = (passport) => passport.use(
  new Strategy(options, async ({ id }, done) => {
    try {
      const user = await User.findOne({ id });

      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      throw new Error(error);
    }
  })
);

export default passportConfig;
