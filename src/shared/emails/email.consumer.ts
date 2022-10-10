import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumer/base.consumer';
import { EmailService } from '@/shared/emails/email.service';
import { MailWorkerData } from '@/shared/emails/interfaces/email';

@Processor('email')
export class EmailConsumer extends BaseConsumer {
  constructor(private emailService: EmailService) {
    super('EmailConsumer');
  }

  @Process({ name: 'sendForgotPasswordEmail', concurrency: 5 })
  public async sendForgotPasswordEmail(
    job: Job<MailWorkerData>,
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
}
