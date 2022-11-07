import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumers/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/contants';
import { ImageJobData } from '@/image/interfaces/image.interface';

@Processor('image')
export class ImageConsumer extends BaseConsumer {
  constructor() {
    super('ImageConsumer');
  }

  @Process({
    name: 'addUserProfilePictureToDB',
    concurrency: CONSUMER_CONCURRENCY,
  })
  public async addUserProfilePictureToDB(
    job: Job<ImageJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
