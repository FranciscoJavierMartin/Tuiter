import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  REDIS_FOLLOWERS_COLLECTION,
  REDIS_FOLLOWING_COLLECTION,
  REDIS_USERS_COLLECTION,
} from '@/shared/constants';
import { ID } from '@/shared/interfaces/types';
import { BaseCache } from '@/shared/redis/base.cache';
import { UserCacheService } from '@/user/services/user.cache.service';
import { UserDocument } from '@/user/models/user.model';
import { FollowerDto } from '@/follower/dto/responses/follower.dto';

@Injectable()
export class FollowerCacheService extends BaseCache {
  constructor(
    configService: ConfigService,
    private readonly userCacheService: UserCacheService,
  ) {
    super('FollowerCache', configService);
  }

  /**
   * Get users who user is following
   * @param userId User id
   * @returns Users who passed user is following
   */
  public async getFollowingUsersFromCache(userId: ID): Promise<FollowerDto[]> {
    return this.getFollowerUsersFromCache(userId, REDIS_FOLLOWING_COLLECTION);
  }

  /**
   * Get users who user is following
   * @param userId User id
   * @returns Users who passed user is following
   */
  public async getFollowersFromCache(userId: ID): Promise<FollowerDto[]> {
    return this.getFollowerUsersFromCache(userId, REDIS_FOLLOWERS_COLLECTION);
  }

  /**
   * Increment following count
   * @param userId User id to increment following count
   */
  public async incrementFollowingCountInCache(userId: ID): Promise<void> {
    return this.updateFollowersCount(userId, 'followingCount', 1);
  }

  /**
   * Increment followers count
   * @param userId User id to increment followers count
   */
  public async incrementFollowersCountInCache(userId: ID): Promise<void> {
    return this.updateFollowersCount(userId, 'followersCount', 1);
  }

  /**
   * Decrement following count
   * @param userId User id to decrement following count
   */
  public async decrementFollowingCountInCache(userId: ID): Promise<void> {
    return this.updateFollowersCount(userId, 'followingCount', -1);
  }

  /**
   * Decrement followers count
   * @param userId User id to decrement followers count
   */
  public async decrementFollowersCountInCache(userId: ID): Promise<void> {
    return this.updateFollowersCount(userId, 'followersCount', -1);
  }

  /**
   * Add follower to followee list
   * @param userId User id who follows followee user
   * @param followeeId User id who is being follow
   */
  public async saveFollowerUserInCache(
    userId: ID,
    followeeId: ID,
  ): Promise<void> {
    return this.storeFollowerInCache(
      `${REDIS_FOLLOWERS_COLLECTION}:${followeeId}`,
      userId,
    );
  }

  /**
   * Add followee to follower list
   * @param userId User id who follows followee user
   * @param followeeId User id who is being follow
   */
  public async saveFollowingUserInCache(
    userId: ID,
    followeeId: ID,
  ): Promise<void> {
    return this.storeFollowerInCache(
      `${REDIS_FOLLOWING_COLLECTION}:${userId}`,
      followeeId,
    );
  }

  /**
   * Remove follower from user list
   * @param userId Follower id
   * @param followeeId Followee id
   */
  public async removeFollowerUserInCache(
    userId: ID,
    followeeId: ID,
  ): Promise<void> {
    return this.deleteFollowerInCache(
      `${REDIS_FOLLOWERS_COLLECTION}:${followeeId}`,
      userId,
    );
  }

  /**
   * Remove following user from user list
   * @param userId User id
   * @param followeeId Followee id
   */
  public async removeFollowingUserInCache(
    userId: ID,
    followeeId: ID,
  ): Promise<void> {
    return this.deleteFollowerInCache(
      `${REDIS_FOLLOWING_COLLECTION}:${userId}`,
      followeeId,
    );
  }

  /**
   * Update followers count
   * @param userId User id to being updated
   * @param field Field to be updated
   * @param value How much increase (or decrease) the count
   */
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

  /**
   * Add element to list
   * @param key List where to add element
   * @param value Element to add
   */
  private async storeFollowerInCache(key: string, value: ID): Promise<void> {
    try {
      await this.client.LPUSH(key, value.toString());
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Remove element from list
   * @param key List where element will be removed
   * @param value Element to be removed
   */
  private async deleteFollowerInCache(key: string, value: ID): Promise<void> {
    try {
      await this.client.LREM(key, 1, value.toString());
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Get followers/following from cache
   * @param userId User id who list belong
   * @param collection Where to get the users
   * @returns Followers/Following users
   */
  private async getFollowerUsersFromCache(
    userId: ID,
    collection: string,
  ): Promise<FollowerDto[]> {
    try {
      const response: string[] = await this.client.LRANGE(
        `${collection}:${userId}`,
        0,
        -1,
      );
      const followingUsers: FollowerDto[] = [];

      for (const item of response) {
        const user: UserDocument = await this.userCacheService.getUserFromCache(
          new ObjectId(item),
        );

        followingUsers.push({
          _id: new mongoose.Types.ObjectId(user._id),
          username: user.username,
          avatarColor: user.avatarColor,
          postsCount: user.postsCount,
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
}
