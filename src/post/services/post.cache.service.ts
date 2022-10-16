import { BaseCache } from '@/shared/redis/base.cache';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Post } from '@/post/models/post.schema';
import { parseJson } from '@/helpers/utils';

@Injectable()
export class PostCacheService extends BaseCache {
  constructor(configService: ConfigService) {
    super('PostCache', configService);
  }

  /**
   * Store post in cache
   * @param key redis key
   * @param currentUserId Author id
   * @param uId user id
   * @param post Post to be created
   */
  public async storePostToCache(
    key: string,
    currentUserId: string,
    uId: string,
    post: Post,
  ) {
    const {
      _id,
      userId,
      username,
      email,
      avatarColor,
      profilePicture,
      text,
      bgColor,
      feelings,
      privacy,
      gifUrl,
      commentsCount,
      imgVersion,
      imgId,
      reactions,
      createdAt,
    } = post;

    const dataToSave: string[] = [
      '_id',
      `${_id}`,
      'userId',
      `${userId}`,
      'username',
      `${username}`,
      'email',
      `${email}`,
      'avatarColor',
      `${avatarColor}`,
      'profilePicture',
      `${profilePicture}`,
      'text',
      `${text}`,
      'bgColor',
      `${bgColor}`,
      'feelings',
      `${feelings}`,
      'privacy',
      `${privacy}`,
      'gifUrl',
      `${gifUrl}`,
      'commentsCount',
      `${commentsCount}`,
      'reactions',
      JSON.stringify(reactions),
      'imgVersion',
      `${imgVersion}`,
      'imgId',
      `${imgId}`,
      'createdAt',
      `${createdAt}`,
    ];

    try {
      const postCount: string[] = await this.client.HMGET(
        `users:${currentUserId}`,
        'postsCount',
      );
      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      multi.ZADD('post', {
        score: parseInt(uId, 10),
        value: key,
      });
      multi.HSET(`posts:${key}`, dataToSave);
      const count: number = parseInt(postCount[0], 10) + 1;
      multi.HSET(`users:${currentUserId}`, ['postsCount', count]);
      multi.exec();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error adding post ${key} to Redis`,
      );
    }
  }

  public async getPostsFromCache(start: number, end: number): Promise<Post[]> {
    try {
      const reply: string[] = await this.client.ZRANGE('post', start, end, {
        REV: true,
      });

      const multi: ReturnType<typeof this.client.multi> = this.client.multi();

      for (const value of reply) {
        multi.HGETALL(`posts:${value}`);
      }

      const replies: Post[] = (await multi.exec()) as unknown[] as Post[];
      return replies.map<Post>((post) => ({
        ...post,
        commentsCount: parseJson(post.commentsCount.toString()),
        reactions: parseJson(post.reactions.toString()),
        createdAt: new Date(parseJson(post.createdAt.toString())),
      }));
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error getting posts from Redis');
    }
  }

  public async getPostsCountInCache(): Promise<number> {
    try {
      return await this.client.ZCARD('post');
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error counting posts from Redis');
    }
  }

  public async deletePostFromCache(
    postId: string,
    authorId: string,
  ): Promise<void> {
    try {
      const postCount: string[] = await this.client.HMGET(
        `users:${authorId}`,
        'postsCount',
      );
      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      multi.ZREM('post', postId);
      multi.DEL(`posts:${postId}`);
      multi.DEL(`comments:${postId}`);
      multi.DEL(`reactions:${postId}`);
      const count: number = parseInt(postCount[0], 10) - 1;
      multi.HSET(`users:${authorId}`, ['postsCount', count]);
      await multi.exec();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error deleting post ${postId} from Redis`,
      );
    }
  }
}
