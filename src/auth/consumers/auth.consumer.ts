import {
  OnGlobalQueueCompleted,
  OnGlobalQueueStalled,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { DoneCallback, Job } from 'bull';
import { AuthDocument } from '../schemas/auth.schema';
import { AuthService } from '../services/auth.service';

@Processor('auth')
export class AuthConsumer {
  private logger: Logger;

  constructor(private authService: AuthService) {
    this.logger = new Logger('AuthConsumer');
  }

  @Process({ name: 'addAuthUserToDB', concurrency: 5 })
  async addAuthUserToDB(job: Job<AuthDocument>, done: DoneCallback) {
    try {
      this.authService.createAuthUser(job.data);
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
