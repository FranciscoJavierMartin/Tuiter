import { OnGlobalQueueCompleted, OnGlobalQueueStalled } from '@nestjs/bull';
import { Logger } from '@nestjs/common';

export abstract class BaseConsumer {
  protected logger: Logger;

  constructor(queueName: string) {
    this.logger = new Logger(queueName);
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
