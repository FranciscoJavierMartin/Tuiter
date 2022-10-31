import { BaseConsumer } from '@/shared/consumer/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/contants';
import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BlockUserRepository } from '@/block-user/repositories/block-user.repository';
import { AddBlockUserJobData } from '@/block-user/interfaces/block-user.interface';

@Processor('blockuser')
export class BlockUserConsumer extends BaseConsumer {
  constructor(private readonly blockUserRepository: BlockUserRepository) {
    super('BlockUserConsumer');
  }

  @Process({ name: 'addBlockUserToDB', concurrency: CONSUMER_CONCURRENCY })
  public async addBlockUserToDB(
    job: Job<AddBlockUserJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      await this.blockUserRepository.blockUser(
        job.data.userId,
        job.data.followerId,
      );
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
