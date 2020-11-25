import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const { log } = console;
const { OAuth2 } = google.auth;

const OAuth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_OAUTH2_SECRET,
  process.env.REDIRECT_URL,
);

OAuth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

const getAccessToken = async () => {
  try {
    const accessToken = await OAuth2Client.getAccessToken();

    return accessToken.token;
  } catch (error) {
    throw new Error('Error while getting smtp access token');
  }
};

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.SMTP_USERNAME,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH2_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    accessToken: getAccessToken().then((t) => t),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transport.verify((error) => {
  if (error) {
    log(error);
  } else {
    log('Server is ready to take our messages');
  }
});

export default transport;
