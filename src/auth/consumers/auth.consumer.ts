import {
  OnGlobalQueueCompleted,
  OnGlobalQueueStalled,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('auth')
export class AuthConsumer {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('AuthConsumer');
  }

  @Process('addAuthUserToDB')
  async addAuthUserToDB(job: Job) {
    console.log('Calling from consumer', job.data);
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
