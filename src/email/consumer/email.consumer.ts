import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumer/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/contants';
import { EmailSenderService } from '@/email/services/email-sender.service';
import {
  MailCommentsNotification,
  MailForgotPasswordData,
  MailResetPasswordData,
} from '@/email/interfaces/email.interface';

@Processor('email')
export class EmailConsumer extends BaseConsumer {
  constructor(private readonly emailSenderService: EmailSenderService) {
    super('EmailConsumer');
  }

  @Process({
    name: 'sendForgotPasswordEmail',
    concurrency: CONSUMER_CONCURRENCY,
  })
  public async sendForgotPasswordEmail(
    job: Job<MailForgotPasswordData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      const { receiverEmail, token, username } = job.data;

      await this.emailSenderService.sendForgotPasswordEmail(
        receiverEmail,
        username,
        token,
      );

      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({
    name: 'sendResetPasswordEmail',
    concurrency: CONSUMER_CONCURRENCY,
  })
  public async sendResetPasswordEmail(
    job: Job<MailResetPasswordData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      const { receiverEmail, username, ipaddress } = job.data;

      await this.emailSenderService.sendResetPasswordEmail(
        receiverEmail,
        username,
        ipaddress,
      );

      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({
    name: 'sendCommentsEmail',
    concurrency: CONSUMER_CONCURRENCY,
  })
  public async sendCommentsEmail(
    job: Job<MailCommentsNotification>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      const { receiverEmail, username, message, header } = job.data;

      await this.emailSenderService.sendCommentsEmail(
        receiverEmail,
        username,
        message,
        header,
      );

      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  // TODO: Merge notification consumers in one single
  @Process({
    name: 'sendFollowersEmail',
    concurrency: CONSUMER_CONCURRENCY,
  })
  public async sendFollowersEmail(
    job: Job<MailCommentsNotification>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      const { receiverEmail, username, message, header } = job.data;

      await this.emailSenderService.sendFollowersEmail(
        receiverEmail,
        username,
        message,
        header,
      );

      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
