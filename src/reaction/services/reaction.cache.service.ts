import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import { BaseCache } from '@/shared/redis/base.cache';
import { Feelings } from '@/post/interfaces/post.interface';
import { AddReactionData } from '@/reaction/interfaces/reaction.interface';
import { Reaction } from '../models/reaction.schema';
import { parseJson } from '@/helpers/utils';

@Injectable()
export class ReactionCacheService extends BaseCache {
  constructor(configService: ConfigService) {
    super('ReactionCache', configService);
  }

  public async savePostReactionToCache(
    key: ObjectId,
    reaction: AddReactionData & { _id: ObjectId },
    postReactions: Record<string, number>,
    previousFeeling?: Feelings,
  ) {
    try {
      if (previousFeeling) {
        this.removePostReactionFromCache(key, reaction.username, postReactions);
      }

      await this.client.LPUSH(`reactions:${key}`, JSON.stringify(reaction));
      const dataToSave: string[] = ['reactions', JSON.stringify(postReactions)];
      await this.client.HSET(`posts:${key}`, dataToSave);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error adding post reaction ${key} to Redis`,
      );
    }
  }

  public async removePostReactionFromCache(
    key: ObjectId,
    username: string,
    postReactions: Record<string, number>,
  ) {
    try {
      const response: string[] = await this.client.LRANGE(
        `reactions:${key}`,
        0,
        -1,
      );

      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      const userPreviousReaction = this.getPreviousReaction(response, username);
      multi.LREM(`reactions:${key}`, 1, JSON.stringify(userPreviousReaction));
      await multi.exec();

      const dataToSave: string[] = ['reactions', JSON.stringify(postReactions)];
      await this.client.HSET(`posts:${key}`, dataToSave);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error removing post reaction ${key} from Redis`,
      );
    }
  }

  private getPreviousReaction(response: string[], username: string): Reaction {
    return response
      .map((item) => parseJson<Reaction>(item))
      .find((item) => item.username === username);
  }
}
