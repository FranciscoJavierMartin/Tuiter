import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { ObjectId } from 'mongodb';
import { BaseConsumer } from '@/shared/consumers/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/constants';
import { EmailService } from '@/email/services/email.service';
import { NotificationType } from '@/notification/interfaces/notification.interface';
import { PostRepository } from '@/post/repositories/post.repository';
import { UserRepository } from '@/user/repositories/user.repository';
import { NotificationService } from '@/notification/notification.service';
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
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationService,
    private readonly reactionCacheService: ReactionCacheService,
    private readonly emailService: EmailService,
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

      job.progress(75);

      const postAuthorId = await this.postRepository.getPostAuthorId(
        job.data.reaction.postId.toString(),
      );
      const postAuthor = await this.userRepository.getUserById(
        new ObjectId(postAuthorId),
      );

      const reactionAuthor = await this.userRepository.getUserByUsername(
        job.data.reaction.username,
      );

      if (
        postAuthor.notifications.reactions &&
        postAuthor.username !== job.data.reaction.username
      ) {
        const notifications = await this.notificationService.insertNotification(
          {
            userFrom: reactionAuthor._id,
            userTo: postAuthor._id,
            message: `${job.data.reaction.username} has reacted to your post`,
            notificationType: NotificationType.reactions,
            entityId: job.data.reaction.postId,
            createdItemId: reactionInDb.upsertedId,
            createdAt: new Date(),
            text: postUpdated.text,
            imgId: postUpdated.imgId,
            imgVersion: postUpdated.imgVersion,
            gifUrl: postUpdated.gifUrl,
          },
        );

        // TODO: emit 'insert notification'

        await this.emailService.sendNotificationEmail(
          postAuthor.email,
          'Post reaction notification',
          job.data.reaction.username,
          `${job.data.reaction.username} has reacted to your post`,
          'Post reaction notification',
        );
      }

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
