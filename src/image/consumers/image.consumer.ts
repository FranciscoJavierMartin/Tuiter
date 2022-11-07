import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumers/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/contants';
import { ImageJobData } from '@/image/interfaces/image.interface';
import { ImageRepository } from '@/image/repositories/image.repository.service';

@Processor('image')
export class ImageConsumer extends BaseConsumer {
  constructor(private readonly imageRepository: ImageRepository) {
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
      // await this.imageRepository.addUserProfileImageToDB()
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
