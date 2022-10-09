import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumer/base.consumer';
import { EmailService } from '@/shared/emails/email.service';

@Processor('email')
export class EmailConsumer extends BaseConsumer {
  constructor(private emailService: EmailService) {
    super('EmailConsumer');
  }

  @Process({ name: 'sendForgotPasswordEmail', concurrency: 5 })
  public async sendForgotPasswordEmail(
    job: Job,
    done: DoneCallback,
  ): Promise<void> {
    try {
      await this.emailService.sendEmail('', '', '');
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
