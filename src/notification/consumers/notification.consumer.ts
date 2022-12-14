import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumers/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/constants';
import { NotificationRepository } from '@/notification/repositories/notification.repository';
import { NotificationJobData } from '@/notification/interfaces/notification.interface';

@Processor('notification')
export class NotificationConsumer extends BaseConsumer {
  constructor(private readonly notificationRepository: NotificationRepository) {
    super('NotificationConsumer');
  }

  @Process({ name: 'updateNotification', concurrency: CONSUMER_CONCURRENCY })
  public async updateNotification(
    job: Job<NotificationJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      await this.notificationRepository.updateNotification(
        job.data.notificationId,
      );
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({ name: 'removeNotification', concurrency: CONSUMER_CONCURRENCY })
  public async removeNotification(
    job: Job<NotificationJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      await this.notificationRepository.removeNotification(
        job.data.notificationId,
      );
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
