import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumer/base.consumer';
import { EmailService } from '@/shared/emails/email.service';
import {
  MailForgotPasswordData,
  MailResetPasswordData,
} from '@/shared/emails/interfaces/email';
import { CONSUMER_CONCURRENCY } from '@/shared/contants';

@Processor('email')
export class EmailConsumer extends BaseConsumer {
  constructor(private emailService: EmailService) {
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

      await this.emailService.sendForgotPasswordEmail(
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
      const { receiverEmail, date, username, ipaddress } = job.data;

      await this.emailService.sendResetPasswordEmail(
        receiverEmail,
        username,
        ipaddress,
        date,
      );

      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
