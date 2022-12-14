import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseJson } from '@/helpers/utils';
import { BaseCache } from '@/shared/redis/base.cache';
import { ID } from '@/shared/interfaces/types';
import { Post } from '@/post/models/post.model';
import {
  REDIS_COMMENTS_COLLECTION,
  REDIS_POSTS_COLLECTION,
  REDIS_REACTIONS_COLLECTION,
  REDIS_USERS_COLLECTION,
} from '@/shared/constants';

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
    currentUserId: ID,
    uId: string,
    post: Post,
  ): Promise<void> {
    const {
      _id,
      authorId,
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
      'authorId',
      `${authorId}`,
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
        `${REDIS_USERS_COLLECTION}:${currentUserId}`,
        'postsCount',
      );
      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      multi.ZADD('post', {
        score: parseInt(uId, 10),
        value: key,
      });
      multi.HSET(`${REDIS_POSTS_COLLECTION}:${key}`, dataToSave);
      const count: number = parseInt(postCount[0], 10) + 1;
      multi.HSET(`${REDIS_USERS_COLLECTION}:${currentUserId}`, [
        'postsCount',
        count,
      ]);
      multi.exec();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error adding post ${key} to Redis`,
      );
    }
  }

  /**
   * Get posts from cache
   * @param start start
   * @param end end
   * @returns Posts from cache
   */
  public async getPostsFromCache(start: number, end: number): Promise<Post[]> {
    try {
      const reply: string[] = await this.client.ZRANGE('post', start, end, {
        REV: true,
      });

      const multi: ReturnType<typeof this.client.multi> = this.client.multi();

      for (const value of reply) {
        multi.HGETALL(`${REDIS_POSTS_COLLECTION}:${value}`);
      }

      const replies: Post[] = (await multi.exec()) as unknown[] as Post[];
      return replies.map<Post>((post) => ({
        ...post,
        commentsCount: parseJson(post.commentsCount?.toString()),
        reactions: parseJson(post.reactions?.toString()),
        createdAt: new Date(parseJson(post.createdAt?.toString())),
      }));
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error getting posts from Redis');
    }
  }

  /**
   * Count posts in cache
   * @returns Number of posts in cache
   */
  public async getPostsCountInCache(): Promise<number> {
    try {
      return await this.client.ZCARD('post');
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error counting posts from Redis');
    }
  }

  /**
   * Delete post in cache
   * @param postId Post id
   * @param authorId Post's author id
   */
  public async deletePostFromCache(
    postId: string,
    authorId: ID,
  ): Promise<void> {
    try {
      const postCount: string[] = await this.client.HMGET(
        `${REDIS_USERS_COLLECTION}:${authorId}`,
        'postsCount',
      );
      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      multi.ZREM('post', postId);
      multi.DEL(`${REDIS_POSTS_COLLECTION}:${postId}`);
      multi.DEL(`${REDIS_COMMENTS_COLLECTION}:${postId}`);
      multi.DEL(`${REDIS_REACTIONS_COLLECTION}:${postId}`);
      const count: number = parseInt(postCount[0], 10) - 1;
      multi.HSET(`${REDIS_USERS_COLLECTION}:${authorId}`, [
        'postsCount',
        count,
      ]);
      await multi.exec();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error deleting post ${postId} from Redis`,
      );
    }
  }

  /**
   * Update post in cache
   * @param postId Post id
   * @param post Post content to be update
   * @returns Updated post
   */
  public async updatePostInCache(postId: string, post: Post): Promise<Post> {
    const {
      text,
      bgColor,
      feelings,
      privacy,
      gifUrl,
      imgVersion,
      imgId,
      profilePicture,
    } = post;
    const dataToSave: string[] = [
      'text',
      `${text ?? ''}`,
      'bgColor',
      `${bgColor ?? ''}`,
      'feelings',
      `${feelings ?? ''}`,
      'privacy',
      `${privacy ?? ''}`,
      'gifUrl',
      `${gifUrl ?? ''}`,
      'profilePicture',
      `${profilePicture ?? ''}`,
      'imgVersion',
      `${imgVersion ?? ''}`,
      'imgId',
      `${imgId ?? ''}`,
    ];

    try {
      await this.client.HSET(`${REDIS_POSTS_COLLECTION}:${postId}`, dataToSave);
      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      multi.HGETALL(`${REDIS_POSTS_COLLECTION}:${postId}`);
      const reply = await multi.exec();
      const postReply = reply as unknown as Post[];
      const updatedPost: Post = postReply[0];

      updatedPost.commentsCount = parseJson(
        updatedPost.commentsCount.toString(),
      );
      updatedPost.reactions = parseJson(updatedPost.reactions.toString());
      updatedPost.createdAt = new Date(
        parseJson(updatedPost.createdAt.toString()),
      );

      return post;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error updating post ${postId} from Redis`,
      );
    }
  }
}
