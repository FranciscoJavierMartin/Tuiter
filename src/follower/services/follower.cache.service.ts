import {
  REDIS_FOLLOWERS_COLLECTION,
  REDIS_FOLLOWING_COLLECTION,
  REDIS_USERS_COLLECTION,
} from '@/shared/contants';
import { ID } from '@/shared/interfaces/types';
import { BaseCache } from '@/shared/redis/base.cache';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FollowerCacheService extends BaseCache {
  constructor(configService: ConfigService) {
    super('FollowerCache', configService);
  }

  public async incrementFollowingCountInCache(userId: ID): Promise<void> {
    return this.updateFollowersCount(userId, 'followingCount', 1);
  }

  public async incrementFollowersCountInCache(userId: ID): Promise<void> {
    return this.updateFollowersCount(userId, 'followingCount', 1);
  }

  public async saveFollowerUserInCache(
    userId: ID,
    followeeId: ID,
  ): Promise<void> {
    return this.storeFollowerInCache(
      `${REDIS_FOLLOWERS_COLLECTION}:${followeeId}`,
      userId,
    );
  }

  public async saveFollowingUserInCache(
    userId: ID,
    followeeId: ID,
  ): Promise<void> {
    return this.storeFollowerInCache(
      `${REDIS_FOLLOWING_COLLECTION}:${userId}`,
      followeeId,
    );
  }

  private async updateFollowersCount(
    userId: ID,
    field: 'followersCount' | 'followingCount',
    value: number,
  ): Promise<void> {
    try {
      await this.client.HINCRBY(
        `${REDIS_USERS_COLLECTION}:${userId}`,
        field,
        value,
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  private async storeFollowerInCache(key: string, value: ID): Promise<void> {
    try {
      await this.client.LPUSH(key, value.toString());
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
