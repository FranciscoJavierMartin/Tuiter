import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import {
  MailNotificationData,
  MailForgotPasswordData,
  MailResetPasswordData,
} from '@/email/interfaces/email.interface';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email')
    private readonly emailQueue: Queue<
      MailForgotPasswordData | MailResetPasswordData | MailNotificationData
    >,
  ) {}

  /**
   * Enqueue send forgot password email
   * @param receiverEmail User email
   * @param username User name
   * @param token Token to be sent
   */
  public async sendForgotPasswordEmail(
    receiverEmail: string,
    username: string,
    token: string,
  ): Promise<void> {
    this.emailQueue.add('sendForgotPasswordEmail', {
      receiverEmail,
      username,
      token,
    });
  }

  /**
   * Enqueue send reset password email
   * @param username User name
   * @param receiverEmail Email address to send
   * @param ipaddress User ip address
   */
  public async sendResetPasswordEmail(
    username: string,
    receiverEmail: string,
    ipaddress: string,
  ): Promise<void> {
    this.emailQueue.add('sendResetPasswordEmail', {
      username,
      receiverEmail,
      ipaddress,
      date: new Date().toLocaleDateString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  }

  /**
   * Enqueue notification email
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
    this.emailQueue.add('sendNotificationEmail', {
      receiverEmail,
      subject,
      username,
      message,
      header,
    });
  }
}
