import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import * as sendGridMail from '@sendgrid/mail';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { ConfigService } from '@nestjs/config';
import { MailOptions } from './interfaces/email';

@Injectable()
export class EmailService {
  private logger: Logger;

  constructor(private configService: ConfigService) {
    this.logger = new Logger('Email');
    sendGridMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  public async sendEmail(
    receiverEmail: string,
    subject: string,
    body: string,
  ): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      await this.sendEmailProduction(receiverEmail, subject, body);
    } else {
      await this.sendEmailDevelopment(receiverEmail, subject, body);
    }
  }

  public getForgotPasswordTemplate(
    username: string,
    resetLink: string,
  ): string {
    return ejs.render(
      fs.readFileSync(__dirname + '/forgot-password-template.ejs', 'utf8'),
      {
        username,
        resetLink,
        image_url:
          'https://res.cloudinary.com/dyshqk0em/image/upload/v1665310488/chatty-nest/lock-icon-email.png',
      },
    );
  }

  private async sendEmailProduction(
    receiverEmail: string,
    subject: string,
    body: string,
  ): Promise<void> {
    const mailOptions: MailOptions = {
      from: `Chatty App <${this.configService.get('SENDER_EMAIL')}>`,
      to: receiverEmail,
      subject,
      html: body,
    };

    try {
      await sendGridMail.send(mailOptions);
      this.logger.log('Production email sent successfully');
    } catch (error) {
      this.logger.error(`Error sending email ${error}`);
      throw new BadGatewayException('Error sending email');
    }
  }

  private async sendEmailDevelopment(
    receiverEmail: string,
    subject: string,
    body: string,
  ): Promise<void> {
    const transporter: Mail = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get('SENDER_EMAIL'),
        pass: this.configService.get('SENDER_EMAIL_PASSWORD'),
      },
    });

    const mailOptions: MailOptions = {
      from: `Chatty App <${this.configService.get('SENDER_EMAIL')}>`,
      to: receiverEmail,
      subject,
      html: body,
    };

    try {
      await transporter.sendMail(mailOptions);
      this.logger.log('Development email sent successfully');
    } catch (error) {
      this.logger.error(`Error sending email ${error}`);
      throw new BadGatewayException('Error sending email');
    }
  }
}
