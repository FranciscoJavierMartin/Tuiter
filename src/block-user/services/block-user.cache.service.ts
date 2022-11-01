import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseJson } from '@/helpers/utils';
import { REDIS_USERS_COLLECTION } from '@/shared/contants';
import { ID } from '@/shared/interfaces/types';
import { BaseCache } from '@/shared/redis/base.cache';

@Injectable()
export class BlockUserCacheService extends BaseCache {
  constructor(configService: ConfigService) {
    super('BlockUserCache', configService);
  }

  /**
   * Check if user is block by followee user
   * @param followeeId Followee user id
   * @param userId User id
   * @returns True if user has been block by followee user, false otherwise
   */
  public async isUserBlockedBy(followeeId: ID, userId: ID): Promise<boolean> {
    try {
      const response = await this.client.HGET(
        `${REDIS_USERS_COLLECTION}:${followeeId}`,
        'blocked',
      );
      const blockedUsers: string[] = parseJson<string[]>(response);
      const userIdString: string = userId.toString();

      return blockedUsers.some((user) => user === userIdString);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Server error. Try again');
    }
  }

  /**
   * Add block to users
   * @param userId User who block id
   * @param followerId User who will be blocked id
   */
  public async blockUser(userId: ID, followerId: ID): Promise<void> {
    await Promise.all([
      this.blockUserInCache(userId, followerId, 'blocked'),
      this.blockUserInCache(followerId, userId, 'blockedBy'),
    ]);
  }

  /**
   * Remove block from user
   * @param userId User who unblock id
   * @param followerId User who is blocked id
   */
  public async unblockUser(userId: ID, followerId: ID): Promise<void> {
    await Promise.all([
      this.unblockUserInCache(userId, followerId, 'blocked'),
      this.unblockUserInCache(followerId, userId, 'blockedBy'),
    ]);
  }

  /**
   * Add block to users in cache
   * @param userId User who block id
   * @param followerId User who will be blocked id
   * @param prop Prop where the id will be added
   */
  private async blockUserInCache(
    userId: ID,
    followerId: ID,
    prop: 'blocked' | 'blockedBy',
  ) {
    try {
      const response: string = await this.client.HGET(
        `${REDIS_USERS_COLLECTION}:${userId}`,
        prop,
      );
      const blocked: string[] = parseJson<string[]>(response);
      blocked.push(followerId.toString());
      await this.client.HSET(`${REDIS_USERS_COLLECTION}:${userId.toString()}`, [
        prop,
        JSON.stringify(blocked),
      ]);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Server error. Try again');
    }
  }

  /**
   * Remove block from users in cache
   * @param userId User who unblock id
   * @param followerId User who will be unblocked id
   * @param prop Prop where the id will be removed
   */
  private async unblockUserInCache(
    userId: ID,
    followerId: ID,
    prop: 'blocked' | 'blockedBy',
  ) {
    try {
      const response: string = await this.client.HGET(
        `${REDIS_USERS_COLLECTION}:${userId}`,
        prop,
      );
      const blocked: string[] = parseJson<string[]>(response);
      const followerIdString = followerId.toString();
      await this.client.HSET(`${REDIS_USERS_COLLECTION}:${userId.toString()}`, [
        prop,
        JSON.stringify(blocked.filter((id) => id !== followerIdString)),
      ]);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Server error. Try again');
    }
  }
}
