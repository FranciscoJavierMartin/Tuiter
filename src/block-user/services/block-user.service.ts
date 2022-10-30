import { ID } from '@/shared/interfaces/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BlockUserCacheService } from '@/block-user/services/block-user.cache.service';
import { FollowerService } from '@/follower/services/follower.service';
import { FollowerRepository } from '@/follower/repositories/follower.repository';

@Injectable()
export class BlockUserService {
  constructor(
    private readonly blockUserCacheService: BlockUserCacheService,
    private readonly followerService: FollowerService,
    private readonly followerRepository: FollowerRepository,
  ) {}

  public async block(userId: ID, followerId: ID) {
    if (await this.blockUserCacheService.isUserBlockedBy(userId, followerId)) {
      throw new BadRequestException('User is already blocked');
    }

    if (await this.followerRepository.isFollowing(followerId, userId)) {
      this.followerService.unfollow(userId, followerId);
    }

    await this.blockUserCacheService.blockUser(userId, followerId);
  }
}
