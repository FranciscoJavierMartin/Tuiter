import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import { BaseCache } from '@/shared/redis/base.cache';
import {
  REDIS_COMMENTS_COLLECTION,
  REDIS_POSTS_COLLECTION,
} from '@/shared/contants';

@Injectable()
export class CommentCacheService extends BaseCache {
  constructor(configService: ConfigService) {
    super('CommentCache', configService);
  }

  public async savePostCommentToCache(
    postId: ObjectId,
    data: string,
  ): Promise<void> {
    try {
      await this.client.LPUSH(`${REDIS_COMMENTS_COLLECTION}:${postId}`, data);
      const commentsCount: string[] = await this.client.HMGET(
        `${REDIS_POSTS_COLLECTION}:${postId}`,
        'commentsCount',
      );
      const count = parseInt(commentsCount[0], 10);
      await this.client.HSET(`${REDIS_POSTS_COLLECTION}:${postId}`, [
        'commentsCount',
        count + 1,
      ]);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error adding comment for post ${postId} to Redis`,
      );
    }
  }
}
