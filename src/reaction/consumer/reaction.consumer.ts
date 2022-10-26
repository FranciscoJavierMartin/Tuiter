import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumer/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/contants';
import { PostRepository } from '@/post/repositories/post.repository';
import { ReactionRepository } from '@/reaction/repositories/reaction.repository';
import {
  AddReactionJobData,
  RemoveReactionJobData,
} from '@/reaction/interfaces/reaction.interface';
import { ReactionCacheService } from '@/reaction/services/reaction.cache.service';

@Processor('reaction')
export class ReactionConsumer extends BaseConsumer {
  constructor(
    private readonly reactionRepository: ReactionRepository,
    private readonly postRepository: PostRepository,
    private readonly reactionCacheService: ReactionCacheService,
  ) {
    super('ReactionConsumer');
  }

  @Process({ name: 'addPostReaction', concurrency: CONSUMER_CONCURRENCY })
  public async addPostReaction(
    job: Job<AddReactionJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      const [reactionInDb, postUpdated] = await Promise.all([
        await this.reactionRepository.saveReaction(
          job.data.reaction,
          job.data.previousFeeling,
        ),
        await this.postRepository.incrementPostReactions(
          job.data.reaction.postId,
          job.data.reaction.feeling,
          job.data.previousFeeling,
        ),
      ]);

      job.progress(50);

      await this.reactionCacheService.savePostReactionToCache(
        job.data.reaction.postId,
        { ...job.data.reaction, _id: reactionInDb.upsertedId },
        postUpdated.reactions,
        job.data.previousFeeling,
      );

      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({ name: 'removePostReaction', concurrency: CONSUMER_CONCURRENCY })
  public async removePostReaction(
    job: Job<RemoveReactionJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      const removedReaction = await this.reactionRepository.removeReaction(
        job.data.postId,
        job.data.username,
      );
      const updatedPost = await this.postRepository.decrementPostReactions(
        job.data.postId,
        removedReaction.feeling,
      );

      job.progress(50);

      await this.reactionCacheService.removePostReactionFromCache(
        job.data.postId,
        job.data.username,
        updatedPost.reactions,
      );
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
