import { Logger } from '@nestjs/common';
import { OnGlobalQueueCompleted, OnGlobalQueueStalled } from '@nestjs/bull';

export abstract class BaseConsumer {
  protected logger: Logger;

  constructor(queueName: string) {
    this.logger = new Logger(queueName);
  }

  @OnGlobalQueueCompleted()
  public onGlobalQueueCompleted(jobId: string): void {
    this.logger.log(`Job ${jobId} completed`);
  }

  @OnGlobalQueueStalled()
  public onGlobalQueueStalled(jobId: string): void {
    this.logger.log(`Job ${jobId} is stalled`);
  }
}
