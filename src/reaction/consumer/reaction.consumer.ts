import { BaseConsumer } from '@/shared/consumer/base.consumer';
import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';

@Processor('reaction')
export class ReactionConsumer extends BaseConsumer {
  constructor() {
    super('ReactionConsumer');
  }

  @Process({ name: 'addPostReactionToDB', concurrency: 5 })
  public async addPostReactionToDB(
    job: Job<any>,
    done: DoneCallback,
  ): Promise<void> {
    job.progress(50);

    job.progress(100);
    done(null, job.data);
    try {
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
