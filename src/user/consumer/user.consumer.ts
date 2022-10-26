import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumer/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/contants';
import { UserDocument } from '@/user/models/user.model';
import { UserRepository } from '@/user/repositories/user.repository';

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
}
