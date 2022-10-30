import { BadRequestException, Injectable } from '@nestjs/common';
import { ID } from '@/shared/interfaces/types';
import { FollowerCacheService } from '@/follower/services/follower.cache.service';

@Injectable()
export class FollowerService {
  constructor(private readonly followerCacheService: FollowerCacheService) {}

  public async follow(followeeId: ID, userId: ID, username: string) {
    if (this.followerCacheService.isUserBlockedBy(followeeId, userId)) {
      throw new BadRequestException('User is blocked by followee user');
    }
  }
}
