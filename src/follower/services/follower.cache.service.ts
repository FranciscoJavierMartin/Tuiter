import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import {
  REDIS_FOLLOWERS_COLLECTION,
  REDIS_FOLLOWING_COLLECTION,
  REDIS_USERS_COLLECTION,
} from '@/shared/contants';
import { ID } from '@/shared/interfaces/types';
import { BaseCache } from '@/shared/redis/base.cache';
import { UserCacheService } from '@/user/services/user.cache.service';
import { UserDocument } from '@/user/models/user.model';
import { FollowerData } from '@/follower/interfaces/follower.interface';
import mongoose from 'mongoose';

@Injectable()
export class FollowerCacheService extends BaseCache {
  constructor(
    configService: ConfigService,
    private readonly userCacheService: UserCacheService,
  ) {
    super('FollowerCache', configService);
  }

  public async getFollowingUsersFromCache(userId: ID) {
    try {
      const response: string[] = await this.client.LRANGE(
        `${REDIS_FOLLOWING_COLLECTION}:${userId}`,
        0,
        -1,
      );
      const followingUsers: FollowerData[] = [];

      for (const item of response) {
        const user: UserDocument = await this.userCacheService.getUserFromCache(
          new ObjectId(item),
        );

        followingUsers.push({
          _id: new mongoose.Types.ObjectId(user._id),
          username: user.username,
          avatarColor: user.avatarColor,
          postCount: user.postsCount,
          followersCount: user.followersCount,
          followingCount: user.followingCount,
          profilePicture: user.profilePicture,
          uId: user.uId,
          userProfile: user,
        });
      }

      return followingUsers;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async incrementFollowingCountInCache(userId: ID): Promise<void> {
    return this.updateFollowersCount(userId, 'followingCount', 1);
  }

  public async incrementFollowersCountInCache(userId: ID): Promise<void> {
    return this.updateFollowersCount(userId, 'followersCount', 1);
  }

  public async decrementFollowingCountInCache(userId: ID): Promise<void> {
    return this.updateFollowersCount(userId, 'followingCount', -1);
  }

  public async decrementFollowersCountInCache(userId: ID): Promise<void> {
    return this.updateFollowersCount(userId, 'followersCount', -1);
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

  public async removeFollowerUserInCache(
    userId: ID,
    followeeId: ID,
  ): Promise<void> {
    return this.deleteFollowerInCache(
      `${REDIS_FOLLOWERS_COLLECTION}:${followeeId}`,
      userId,
    );
  }

  public async removeFollowingUserInCache(
    userId: ID,
    followeeId: ID,
  ): Promise<void> {
    return this.deleteFollowerInCache(
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

  private async deleteFollowerInCache(key: string, value: ID): Promise<void> {
    try {
      await this.client.LREM(key, 1, value.toString());
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
