import dotenv from 'dotenv';
import ejs from 'ejs';
import path from 'path';
import logger from '../helpers/logger';
import transport from '../config/EmailConfig';

dotenv.config();

class EmailService {
  constructor(receiver, subject, content = null) {
    this.receiver = receiver;
    this.subject = subject;
    this.content = content;
    this.transport = transport;
  }

  async sendEmail(template, templateData) {
    // Get the EJS file that will be used to generate the HTML
    const file = path.join(__dirname, `../views/${template}.ejs`);

    // if file is not found
    if (!file) {
      return logger.error(`Could not find the ${template} in path ${file}`);
    }

    return ejs.renderFile(file, templateData, async (error, html) => {
      if (error) {
        logger.error(error);
        throw new Error(error);
      }
      this.content = html;
      const emailOptions = {
        to: this.receiver,
        subject: this.subject,
        html: this.content,
        from: 'Kathekon',
      };

      await this.transport.sendMail(emailOptions, (err, info) => {
        if (error) {
          logger.error(err);
        }
        logger.info(info);
      });
      return html;
    });
  }
}

export default EmailService;
