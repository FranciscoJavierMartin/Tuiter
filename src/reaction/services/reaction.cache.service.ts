import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import { BaseCache } from '@/shared/redis/base.cache';
import { Feelings } from '@/post/interfaces/post.interface';
import { AddReactionData } from '@/reaction/interfaces/reaction.interface';

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
      // if (previousFeeling) {
      //   this.removePostReactionFromCache(key, reaction.username);
      // }

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
}
