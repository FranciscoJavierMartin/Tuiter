import {
  OnGlobalQueueCompleted,
  OnGlobalQueueStalled,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { DoneCallback, Job } from 'bull';
import { UserDocument } from '../schemas/user.schema';
import { UserService } from '../services/user.service';

@Processor('user')
export class UserConsumer {
  private logger: Logger;

  constructor(private userService: UserService) {
    this.logger = new Logger('UserConsumer');
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

  @OnGlobalQueueCompleted()
  onGlobalQueueCompleted(jobId: string): void {
    this.logger.log(`Job ${jobId} completed`);
  }

  @OnGlobalQueueStalled()
  onGlobalQueueStalled(jobId: string): void {
    this.logger.log(`Job ${jobId} is stalled`);
  }
}
