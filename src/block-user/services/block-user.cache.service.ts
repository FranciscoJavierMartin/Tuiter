import { parseJson } from '@/helpers/utils';
import { REDIS_USERS_COLLECTION } from '@/shared/contants';
import { ID } from '@/shared/interfaces/types';
import { BaseCache } from '@/shared/redis/base.cache';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlockUserCacheService extends BaseCache {
  constructor(configService: ConfigService) {
    super('BlockUserCache', configService);
  }

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

  public async blockUser(userId: ID, followerId: ID): Promise<void[]> {
    return Promise.all([
      this.blockUserInCache(userId, followerId, 'blocked'),
      this.blockUserInCache(followerId, userId, 'blockedBy'),
    ]);
  }

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
}
