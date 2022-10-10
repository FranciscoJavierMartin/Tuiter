import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import * as sendGridMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

type Templates = 'forgot-password-template' | 'reset-password-template';

@Injectable()
export class EmailService {
  private logger: Logger;

  constructor(
    private configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    this.logger = new Logger('Email');
    sendGridMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  public async sendForgotPasswordEmail(
    receiverEmail: string,
    username: string,
    token: string,
  ): Promise<void> {
    const resetLink = `${this.configService.get(
      'CLIENT_URL',
    )}/reset-password?token=${token}`;

    await this.sendEmail(
      receiverEmail,
      'Reset your password',
      'forgot-password-template',
      {
        username,
        resetLink,
        image_url:
          'https://res.cloudinary.com/dyshqk0em/image/upload/v1665310488/chatty-nest/lock-icon-email.png',
      },
    );
  }

  public async sendResetPasswordEmail(
    receiverEmail: string,
    username: string,
    ipaddress: string,
    date: string,
  ): Promise<void> {
    await this.sendEmail(
      receiverEmail,
      'Password Reset Confirmation',
      'reset-password-template',
      {
        username,
        email: receiverEmail,
        ipaddress,
        date,
        image_url:
          'https://res.cloudinary.com/dyshqk0em/image/upload/v1665310488/chatty-nest/lock-icon-email.png',
      },
    );
  }

  private async sendEmail(
    receiverEmail: string,
    subject: string,
    template: Templates,
    variables?: { [key: string]: string },
  ) {
    try {
      await this.mailerService.sendMail({
        to: receiverEmail,
        subject,
        template,
        context: variables,
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadGatewayException(error, 'Error sending email');
    }
  }
}
