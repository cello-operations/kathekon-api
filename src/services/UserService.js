import gravatar from 'gravatar';
import { hashSync, compareSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cryptoRandomString from 'crypto-random-string';

dotenv.config();

class UserService {
  constructor(email, password) {
    this.email = email;
    this.password = password;
    this.avatar = '';
    this.token = '';
    this.verificationToken = '';
  }

  getValues() {
    return {
      email: this.email,
      encryptedPassword: this.password,
      token: this.token,
      verificationToken: this.verificationToken
    };
  }

  generateDefaultAvatar() {
    this.avatar = gravatar.url(this.email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });
    return this.avatar;
  }

  encryptPassword() {
    this.password = hashSync(this.password, 10);
    this.verificationToken = cryptoRandomString({ length: 20, type: 'url-safe' });
    return this;
  }

  generateToken({
    _id, id, email, isVerified,
    firstTimePasswordChanged, firstName, lastName,
    avatar, createdOn, updatedOn,
  }) {
    const { JWT_SECRET } = process.env;
    const payload = {
      _id,
      id,
      email,
      isVerified,
      firstTimePasswordChanged,
      firstName,
      lastName,
      avatar,
      createdOn,
      updatedOn,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    this.token = token;

    return this;
  }

  decryptPassword(encryptedPassword) {
    return compareSync(this.password, encryptedPassword);
  }

  static comparePasswords(password, encryptedPassword) {
    return compareSync(password, encryptedPassword);
  }
}

export default UserService;
