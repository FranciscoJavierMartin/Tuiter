import { BaseConsumer } from '@/shared/consumer/base.consumer';
import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { ReactionRepository } from '@/reaction/repositories/reaction.repository';
import { AddReactionJobData } from '../interfaces/reaction.interface';
import { PostRepository } from '@/post/repositories/post.repository';

@Processor('reaction')
export class ReactionConsumer extends BaseConsumer {
  constructor(
    private readonly reactionRepository: ReactionRepository,
    private readonly postRepository: PostRepository,
  ) {
    super('ReactionConsumer');
  }

  @Process({ name: 'addPostReaction', concurrency: 5 })
  public async addPostReactionToDB(
    job: Job<AddReactionJobData>,
    done: DoneCallback,
  ): Promise<void> {
    await Promise.all([
      await this.reactionRepository.saveReaction(
        job.data.reaction,
        job.data.previousFeeling,
      ),
      await this.postRepository.updatePostReactions(
        job.data.reaction.postId,
        job.data.reaction.feeling,
        job.data.previousFeeling,
      ),
    ]);
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
