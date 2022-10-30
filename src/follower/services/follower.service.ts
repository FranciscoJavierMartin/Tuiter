import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ID } from '@/shared/interfaces/types';
import { FollowerCacheService } from '@/follower/services/follower.cache.service';
import { BlockUserCacheService } from '@/block-user/services/block-user.cache.service';
import { FollowerRepository } from '@/follower/repositories/follower.repository';
import { FollowJobData } from '@/follower/interfaces/follower.interface';

@Injectable()
export class FollowerService {
  constructor(
    private readonly followerCacheService: FollowerCacheService,
    private readonly blockUserCacheService: BlockUserCacheService,
    private readonly followerRepository: FollowerRepository,
    @InjectQueue('follower')
    private readonly followerQueue: Queue<FollowJobData>,
  ) {}

  /**
   * Check if user is blocked
   * Check if user is following
   * Increase following count
   * Increase followers count
   * Add to following list
   * Add to followers list
   */
  public async follow(
    followeeId: ID,
    userId: ID,
    username: string,
  ): Promise<void> {
    // TODO: Remove when decorator is stable
    if (await this.blockUserCacheService.isUserBlockedBy(followeeId, userId)) {
      throw new BadRequestException('User is blocked by followee user');
    }

    // TODO: Move to decorator
    if (await this.followerRepository.isFollowing(userId, followeeId)) {
      throw new BadRequestException('User is already following followee user');
    }

    await Promise.all([
      this.followerCacheService.incrementFollowingCountInCache(userId),
      this.followerCacheService.incrementFollowersCountInCache(followeeId),
      this.followerCacheService.saveFollowerUserInCache(userId, followeeId),
      this.followerCacheService.saveFollowingUserInCache(userId, followeeId),
    ]);

    // TODO: Emit "add follower"

    this.followerQueue.add('addFollowerToDB', {
      followeeId,
      userId,
    });
  }

  public async unfollow(followeeId: ID, userId: ID): Promise<void> {
    // TODO: Move to decorator
    if (!(await this.followerRepository.isFollowing(userId, followeeId))) {
      throw new BadRequestException('User is not following followee user');
    }

    await Promise.all([
      this.followerCacheService.decrementFollowingCountInCache(userId),
      this.followerCacheService.decrementFollowersCountInCache(followeeId),
      this.followerCacheService.removeFollowerUserInCache(userId, followeeId),
      this.followerCacheService.removeFollowingUserInCache(userId, followeeId),
    ]);

    this.followerQueue.add('removeFollowerFromDB', {
      followeeId,
      userId,
    });
  }

  public async getFollowingUsers(userId: ID) {
    const cachedFollowingUsers =
      await this.followerCacheService.getFollowingUsersFromCache(userId);

    const followingUsers = cachedFollowingUsers.length
      ? cachedFollowingUsers
      : await this.followerRepository.getFollowingUsers(userId);

    return followingUsers;
  }

  public async getFollowers(userId: ID) {
    const cachedFollowers =
      await this.followerCacheService.getFollowersFromCache(userId);

    const followers = cachedFollowers.length
      ? cachedFollowers
      : await this.followerRepository.getFollowers(userId);

    return followers;
  }
}
