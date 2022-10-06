import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from 'src/shared/consumer/base.consumer';
import { UserDocument } from '../schemas/user.schema';
import { UserService } from '../services/user.service';

@Processor('user')
export class UserConsumer extends BaseConsumer {
  constructor(private userService: UserService) {
    super('UserConsumer');
  }

  @Process({ name: 'addUserToDB', concurrency: 5 })
  async addUserToDB(job: Job<UserDocument>, done: DoneCallback): Promise<void> {
    try {
      await this.userService.addUserData(job.data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
