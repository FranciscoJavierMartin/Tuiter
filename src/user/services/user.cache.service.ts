import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseJson } from '@/helpers/utils';
import { BaseCache } from '@/shared/redis/base.cache';
import { UserDocument } from '@/user/models/user.model';
import { REDIS_USERS_COLLECTION } from '@/shared/contants';

@Injectable()
export class UserCacheService extends BaseCache {
  constructor(configService: ConfigService) {
    super('UserCache', configService);
  }

  /**
   * Store user in cache
   * @param key redis key
   * @param userId user id related to stored user
   * @param createdUser User to be stored
   */
  public async storeUserToCache(
    key: string,
    userId: string,
    createdUser: UserDocument,
  ): Promise<void> {
    const createdAt = new Date();
    const {
      _id,
      uId,
      username,
      email,
      avatarColor,
      blocked,
      blockedBy,
      postsCount,
      profilePicture,
      followersCount,
      followingCount,
      notifications,
      work,
      location,
      school,
      quote,
      bgImageId,
      bgImageVersion,
      social,
    } = createdUser;
    const dataToSave: string[] = [
      '_id',
      `${_id}`,
      'uId',
      `${uId}`,
      'username',
      `${username}`,
      'email',
      `${email}`,
      'avatarColor',
      `${avatarColor}`,
      'createdAt',
      `${createdAt}`,
      'postsCount',
      `${postsCount}`,
      'blocked',
      JSON.stringify(blocked),
      'blockedBy',
      JSON.stringify(blockedBy),
      'profilePicture',
      `${profilePicture}`,
      'followersCount',
      `${followersCount}`,
      'followingCount',
      `${followingCount}`,
      'notifications',
      JSON.stringify(notifications),
      'social',
      JSON.stringify(social),
      'work',
      `${work}`,
      'location',
      `${location}`,
      'school',
      `${school}`,
      'quote',
      `${quote}`,
      'bgImageVersion',
      `${bgImageVersion}`,
      'bgImageId',
      `${bgImageId}`,
    ];

    try {
      await this.client.ZADD('user', {
        score: parseInt(userId, 10),
        value: key,
      });
      await this.client.HSET(`${REDIS_USERS_COLLECTION}:${key}`, dataToSave);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error adding user ${key} to Redis`,
      );
    }
  }

  /**
   * Retrieve user from cache
   * @param key User key to search
   * @returns
   */
  public async getUserFromCache(key: string): Promise<UserDocument | null> {
    try {
      const response: UserDocument = (await this.client.HGETALL(
        `users:${key}`,
      )) as unknown as UserDocument;

      response.createdAt = new Date(parseJson(`${response.createdAt}`));
      response.postsCount = parseJson(`${response.postsCount}`);
      response.blocked = parseJson(`${response.blocked}`);
      response.blockedBy = parseJson(`${response.blockedBy}`);
      response.notifications = parseJson(`${response.notifications}`);
      response.social = parseJson(`${response.social}`);
      response.followersCount = parseJson<number>(`${response.followersCount}`);
      response.followingCount = parseJson<number>(`${response.followingCount}`);

      return response;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Server error. Try again');
    }
  }
}
