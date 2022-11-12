import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseJson } from '@/helpers/utils';
import { BaseCache } from '@/shared/redis/base.cache';
import { REDIS_USERS_COLLECTION } from '@/shared/contants';
import { ID } from '@/shared/interfaces/types';
import { UserDocument } from '@/user/models/user.model';

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
   * Update user attribute in cache
   * @param userId User id
   * @param field Attribute name to be updated
   * @param value New value
   * @returns Updated user
   */
  public async updateUserAttributeInCache(
    userId: ID,
    field: string,
    value: string,
  ): Promise<UserDocument> {
    try {
      await this.client.HSET(`${REDIS_USERS_COLLECTION}:${userId}`, [
        field,
        value,
      ]);
      return await this.getUserFromCache(userId);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error updating user ${userId} in Redis`,
      );
    }
  }

  /**
   * Retrieve user from cache
   * @param userId User key to search
   * @returns
   */
  public async getUserFromCache(userId: ID): Promise<UserDocument | null> {
    try {
      const response: UserDocument = (await this.client.HGETALL(
        `${REDIS_USERS_COLLECTION}:${userId}`,
      )) as unknown as UserDocument;

      // TODO: Cast notifications and social
      response.createdAt = new Date(parseJson(`${response.createdAt}`));
      response.postsCount = parseJson<number>(`${response.postsCount}`);
      response.blocked = parseJson<string[]>(`${response.blocked}`);
      response.blockedBy = parseJson<string[]>(`${response.blockedBy}`);
      response.notifications = parseJson(`${response.notifications}`);
      response.social = parseJson(`${response.social}`);
      response.followersCount = parseJson<number>(`${response.followersCount}`);
      response.followingCount = parseJson<number>(`${response.followingCount}`);
      response.profilePicture = parseJson<string>(`${response.profilePicture}`);
      response.bgImageId = parseJson<string>(`${response.bgImageId}`);
      response.bgImageVersion = parseJson<string>(`${response.bgImageVersion}`);

      return response;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Server error. Try again');
    }
  }
}
