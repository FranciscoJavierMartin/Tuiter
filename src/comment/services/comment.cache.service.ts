import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseJson } from '@/helpers/utils';
import { BaseCache } from '@/shared/redis/base.cache';
import {
  REDIS_COMMENTS_COLLECTION,
  REDIS_POSTS_COLLECTION,
} from '@/shared/constants';
import { ID } from '@/shared/interfaces/types';
import { Comment } from '@/comment/models/comment.model';

@Injectable()
export class CommentCacheService extends BaseCache {
  constructor(configService: ConfigService) {
    super('CommentCache', configService);
  }

  /**
   * Store comment in cache
   * @param postId Post id where comment belong
   * @param data Comment data to be stored in string format
   */
  public async savePostCommentToCache(postId: ID, data: string): Promise<void> {
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

  public async getCommentsFromCache(postId: ID): Promise<Comment[]> {
    try {
      const comments: string[] = await this.client.LRANGE(
        `${REDIS_COMMENTS_COLLECTION}:${postId}`,
        0,
        -1,
      );

      return comments.map((comment) => parseJson<Comment>(comment));
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error adding comment for post ${postId} to Redis`,
      );
    }
  }
}
