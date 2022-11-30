import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumers/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/constants';
import { UploaderService } from '@/shared/services/uploader.service';
import {
  AddImageJobData,
  AddUserProfilePictureJobData,
  RemoveImageJobData,
  UpdateImageJobData,
} from '@/image/interfaces/image.interface';
import { ImageRepository } from '@/image/repositories/image.repository';
import { Image } from '@/image/models/image.model';

@Processor('image')
export class ImageConsumer extends BaseConsumer {
  constructor(
    private readonly uploaderService: UploaderService,
    private readonly imageRepository: ImageRepository,
  ) {
    super('ImageConsumer');
  }

  @Process({
    name: 'addUserProfilePictureToDB',
    concurrency: CONSUMER_CONCURRENCY,
  })
  public async addUserProfilePictureToDB(
    job: Job<AddUserProfilePictureJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      await this.imageRepository.addUserProfilePictureToDB(
        job.data.ownerId,
        job.data.profilePictureUrl,
        job.data.imgId,
        job.data.imgVersion,
      );
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({
    name: 'addBackgroundImageToDB',
    concurrency: CONSUMER_CONCURRENCY,
  })
  public async addBackgroundImageToDB(
    job: Job<AddImageJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      await this.imageRepository.addBackgroundImageToDB(
        job.data.ownerId,
        job.data.imgId,
        job.data.imgVersion,
      );
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({
    name: 'addImageToDb',
    concurrency: CONSUMER_CONCURRENCY,
  })
  public async addImageToDb(
    job: Job<AddImageJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      await this.imageRepository.addImage(
        job.data.ownerId,
        job.data.imgId,
        job.data.imgVersion,
        job.data.isVideo,
      );
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({
    name: 'updateImageInDb',
    concurrency: CONSUMER_CONCURRENCY,
  })
  public async updateImageInDb(
    job: Job<UpdateImageJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      await this.imageRepository.updateImage(
        job.data.imgId,
        job.data.imgVersion,
      );
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({
    name: 'removeImage',
    concurrency: CONSUMER_CONCURRENCY,
  })
  public async removeImage(
    job: Job<RemoveImageJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      const imageDeleted: Image = await this.imageRepository.removeImageFromDB(
        job.data.imageId,
      );
      job.progress(50);

      await this.uploaderService.removeImage(imageDeleted.imgId);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
