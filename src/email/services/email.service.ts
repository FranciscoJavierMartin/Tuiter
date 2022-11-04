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
}
