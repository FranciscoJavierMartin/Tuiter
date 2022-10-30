import { BaseConsumer } from '@/shared/consumer/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/contants';
import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { AddFollowJobData } from '@/follower/interfaces/follower.interface';
import { FollowerRepository } from '@/follower/repositories/follower.repository';

@Processor('follower')
export class FollowerConsumer extends BaseConsumer {
  constructor(private readonly followerRepository: FollowerRepository) {
    super('FollowerConsumer');
  }

  @Process({ name: 'addFollowerToDB', concurrency: CONSUMER_CONCURRENCY })
  public async addFollowerToDB(
    job: Job<AddFollowJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      await this.followerRepository.saveFollowerInDB(
        job.data.userId,
        job.data.followeeId,
      );
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
