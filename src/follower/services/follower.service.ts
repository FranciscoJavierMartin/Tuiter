import { BadRequestException, Injectable } from '@nestjs/common';
import { ID } from '@/shared/interfaces/types';
import { FollowerCacheService } from '@/follower/services/follower.cache.service';
import { BlockUserCacheService } from '@/follower/services/block-user.cache.service';
import { FollowerRepository } from '@/follower/repositories/follower.repository';
import { UserCacheService } from '@/user/services/user.cache.service';

@Injectable()
export class FollowerService {
  constructor(
    private readonly userCacheService: UserCacheService,
    private readonly followerCacheService: FollowerCacheService,
    private readonly blockUserCacheService: BlockUserCacheService,
    private readonly followerRepository: FollowerRepository,
  ) {}

  public async follow(followeeId: ID, userId: ID, username: string) {
    // TODO: Remove when decorator is stable
    if (await this.blockUserCacheService.isUserBlockedBy(followeeId, userId)) {
      throw new BadRequestException('User is blocked by followee user');
    }

    // TODO: Move to decorator
    if (await this.followerRepository.isFollowing(userId, followeeId)) {
      throw new BadRequestException('User is already following followee user');
    }
  }
}
