import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumers/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/constants';
import { UserDocument } from '@/user/models/user.model';
import { UserRepository } from '@/user/repositories/user.repository';
import {
  UpdateNotificationSettingsJobData,
  UpdateSocialLinksJobData,
  UpdateUserJobData,
} from '@/user/interfaces/user.interface';

@Processor('user')
export class UserConsumer extends BaseConsumer {
  constructor(private readonly userRepository: UserRepository) {
    super('UserConsumer');
  }

  @Process({ name: 'addUserToDB', concurrency: CONSUMER_CONCURRENCY })
  public async addUserToDB(
    job: Job<UserDocument>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      await this.userRepository.addUserDataToDB(job.data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({ name: 'updateUserInDB', concurrency: CONSUMER_CONCURRENCY })
  public async updateUserInDB(
    job: Job<UpdateUserJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      await this.userRepository.updateUser(job.data.userId, job.data.data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({ name: 'updateSocialLinksInDB', concurrency: CONSUMER_CONCURRENCY })
  public async updateSocialLinksInDB(
    job: Job<UpdateSocialLinksJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      await this.userRepository.updateSocialLinks(
        job.data.userId,
        job.data.socialLinks,
      );
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({
    name: 'updateNotificationSettingsInDB',
    concurrency: CONSUMER_CONCURRENCY,
  })
  public async updateNotificationSettingsInDB(
    job: Job<UpdateNotificationSettingsJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      await this.userRepository.updateNotificationSettings(
        job.data.userId,
        job.data.notificationSettings,
      );
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
