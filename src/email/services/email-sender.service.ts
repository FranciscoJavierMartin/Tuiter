import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import * as sendGridMail from '@sendgrid/mail';

type Templates =
  | 'forgot-password-template'
  | 'reset-password-template'
  | 'notification-template';

const lockImage: string = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1667416093/${process.env.CLOUDINARY_FOLDER}/lock-icon.png`;

@Injectable()
export class EmailSenderService {
  private logger: Logger;

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    this.logger = new Logger('Email');
    sendGridMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  /**
   * Send email to change user password throught token
   * @param receiverEmail User email
   * @param username User name
   * @param token Token to be sent
   */
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
        image_url: lockImage,
      },
    );
  }

  /**
   * Send email to user informing about password change
   * @param receiverEmail Email address to send
   * @param subject Email subject
   * @param username User name
   * @param ipaddress User ip address
   */
  public async sendResetPasswordEmail(
    receiverEmail: string,
    subject: string,
    username: string,
    ipaddress: string,
  ): Promise<void> {
    await this.sendEmail(receiverEmail, subject, 'reset-password-template', {
      username,
      email: receiverEmail,
      ipaddress,
      date: new Date().toLocaleDateString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      }),
      image_url: lockImage,
    });
  }

  /**
   * Send email notification
   * @param receiverEmail Email address to send
   * @param subject Email subject
   * @param username User name
   * @param message Message to be shown in the template
   * @param header Header text in email
   */
  public async sendNotificationEmail(
    receiverEmail: string,
    subject: string,
    username: string,
    message: string,
    header: string,
  ): Promise<void> {
    await this.sendEmail(receiverEmail, subject, 'notification-template', {
      username,
      message,
      header,
      image_url: lockImage,
    });
  }

  /**
   * Send email
   * @param receiverEmail Destination email
   * @param subject Email subject
   * @param template Text to be included in email
   * @param variables Variables to be interpolated in email template
   */
  private async sendEmail(
    receiverEmail: string,
    subject: string,
    template: Templates,
    variables?: { [key: string]: string },
  ): Promise<void> {
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
