import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseJson } from '@/helpers/utils';
import { ID } from '@/shared/interfaces/types';
import { BaseCache } from '@/shared/redis/base.cache';
import {
  REDIS_POSTS_COLLECTION,
  REDIS_REACTIONS_COLLECTION,
} from '@/shared/contants';
import { Feelings } from '@/reaction/interfaces/reaction.interface';
import {
  AddReactionData,
  Reactions,
} from '@/reaction/interfaces/reaction.interface';
import { Reaction } from '@/reaction/models/reaction.model';

@Injectable()
export class ReactionCacheService extends BaseCache {
  constructor(configService: ConfigService) {
    super('ReactionCache', configService);
  }

  /**
   * Save post reaction in cache
   * @param postId Post id
   * @param reaction Reaction data to be stored. Include reaction id
   * @param postReactions Post reactions
   * @param previousFeeling (Optional) Previous feeling
   */
  public async savePostReactionToCache(
    postId: ID,
    reaction: AddReactionData & { _id: ID },
    postReactions: Reactions,
    previousFeeling?: Feelings,
  ): Promise<void> {
    try {
      if (previousFeeling) {
        this.removePostReactionFromCache(
          postId,
          reaction.username,
          postReactions,
        );
      }

      await this.client.LPUSH(
        `${REDIS_REACTIONS_COLLECTION}:${postId}`,
        JSON.stringify(reaction),
      );
      const dataToSave: string[] = ['reactions', JSON.stringify(postReactions)];
      await this.client.HSET(`${REDIS_POSTS_COLLECTION}:${postId}`, dataToSave);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error adding post reaction ${postId} to Redis`,
      );
    }
  }

  /**
   * Remove reaction from cache
   * @param postId Post id
   * @param username Username who react to post
   * @param postReactions Update post reactions
   */
  public async removePostReactionFromCache(
    postId: ID,
    username: string,
    postReactions: Reactions,
  ): Promise<void> {
    try {
      const response: string[] = await this.client.LRANGE(
        `${REDIS_REACTIONS_COLLECTION}:${postId}`,
        0,
        -1,
      );

      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      const userPreviousReaction = this.getPreviousReaction(response, username);
      multi.LREM(
        `${REDIS_REACTIONS_COLLECTION}:${postId}`,
        1,
        JSON.stringify(userPreviousReaction),
      );
      await multi.exec();

      const dataToSave: string[] = ['reactions', JSON.stringify(postReactions)];
      await this.client.HSET(`${REDIS_POSTS_COLLECTION}:${postId}`, dataToSave);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error removing post reaction ${postId} from Redis`,
      );
    }
  }

  /**
   * Get previous reaction
   * @param response Reactions
   * @param username Username to filter
   * @returns Reaction result
   */
  private getPreviousReaction(response: string[], username: string): Reaction {
    return response
      .map((item) => parseJson<Reaction>(item))
      .find((item) => item.username === username);
  }
}
