import { ID } from '@/shared/interfaces/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { FollowerService } from '@/follower/services/follower.service';
import { FollowerRepository } from '@/follower/repositories/follower.repository';
import { BlockUserCacheService } from '@/block-user/services/block-user.cache.service';
import { BlockUserJobData } from '@/block-user/interfaces/block-user.interface';

@Injectable()
export class BlockUserService {
  constructor(
    private readonly blockUserCacheService: BlockUserCacheService,
    private readonly followerService: FollowerService,
    private readonly followerRepository: FollowerRepository,
    @InjectQueue('blockuser')
    private readonly blockUserQueue: Queue<BlockUserJobData>,
  ) {}

  public async block(userId: ID, followerId: ID) {
    const mio = await this.followerRepository.isFollowing(followerId, userId);
    console.log(mio);
    return mio;

    //   if (await this.blockUserCacheService.isUserBlockedBy(userId, followerId)) {
    //   throw new BadRequestException('User is already blocked');
    // }

    // if (await this.followerRepository.isFollowing(followerId, userId)) {
    //   this.followerService.unfollow(userId, followerId);
    // }

    // await this.blockUserCacheService.blockUser(userId, followerId);

    // this.blockUserQueue.add('addBlockUserToDB', {
    //   userId,
    //   followerId,
    // });
  }
}
