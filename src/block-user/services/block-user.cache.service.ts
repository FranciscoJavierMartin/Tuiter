import { parseJson } from '@/helpers/utils';
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
      const response = await this.client.HGET(`users:${userId}`, 'blocked');
      const blockedUsers: string[] = parseJson<string[]>(response);
      const followeeIdString: string = followeeId.toString();

      return blockedUsers.some((user) => user === followeeIdString);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Server error. Try again');
    }
  }
}
