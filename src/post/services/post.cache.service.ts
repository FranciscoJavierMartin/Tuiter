import { BaseCache } from '@/shared/redis/base.cache';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Post } from '../models/post.schema';

@Injectable()
export class PostCacheService extends BaseCache {
  constructor(configService: ConfigService) {
    super('PostCache', configService);
  }

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
}
