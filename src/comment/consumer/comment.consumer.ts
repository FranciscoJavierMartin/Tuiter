import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumer/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/contants';
import { AddCommentJobData } from '@/comment/interfaces/comment.interface';
import { CommentRepository } from '@/comment/repositories/comment.repository';

@Processor('comment')
export class CommentConsumer extends BaseConsumer {
  constructor(private readonly commentRepository: CommentRepository) {
    super('CommentConsumer');
  }

  @Process({ name: 'addCommentToDB', concurrency: CONSUMER_CONCURRENCY })
  public async addCommentToDB(
    job: Job<AddCommentJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      this.commentRepository.addCommentToDB(job.data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
