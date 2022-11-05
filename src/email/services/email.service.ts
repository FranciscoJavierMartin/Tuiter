import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import {
  MailCommentsNotification,
  MailForgotPasswordData,
  MailResetPasswordData,
} from '@/email/interfaces/email.interface';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email')
    private readonly emailQueue: Queue<
      MailForgotPasswordData | MailResetPasswordData | MailCommentsNotification
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
   * Enqueue notification email about comment in a post
   * @param receiverEmail Email address to send
   * @param username User name
   * @param username Message to be shown in the template
   * @param header Header text in email
   */
  public async sendCommentsEmail(
    receiverEmail: string,
    username: string,
    message: string,
    header: string,
  ): Promise<void> {
    this.emailQueue.add('sendCommentsEmail', {
      receiverEmail,
      username,
      message,
      header,
    });
  }

  public async sendFollowersEmail(
    receiverEmail: string,
    username: string,
    message: string,
    header: string,
  ): Promise<void> {
    this.emailQueue.add('sendFollowersEmail', {
      receiverEmail,
      username,
      message,
      header,
    });
  }

  public async sendReactionsEmail(
    receiverEmail: string,
    username: string,
    message: string,
    header: string,
  ): Promise<void> {
    this.emailQueue.add('sendReactionsEmail', {
      receiverEmail,
      username,
      message,
      header,
    });
  }
}
