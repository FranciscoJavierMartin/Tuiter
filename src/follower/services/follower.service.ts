import { BadRequestException, Injectable } from '@nestjs/common';
import { ID } from '@/shared/interfaces/types';
import { FollowerCacheService } from '@/follower/services/follower.cache.service';
import { BlockUserCacheService } from '@/follower/services/block-user.cache.service';

@Injectable()
export class FollowerService {
  constructor(
    private readonly followerCacheService: FollowerCacheService,
    private readonly blockUserCacheService: BlockUserCacheService,
  ) {}

  public async follow(followeeId: ID, userId: ID, username: string) {
    if (await this.blockUserCacheService.isUserBlockedBy(followeeId, userId)) {
      throw new BadRequestException('User is blocked by followee user');
    }
  }
}
