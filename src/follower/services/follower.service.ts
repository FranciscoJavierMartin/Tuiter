import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ID } from '@/shared/interfaces/types';
import { BlockUserCacheService } from '@/block-user/services/block-user.cache.service';
import { FollowerCacheService } from '@/follower/services/follower.cache.service';
import { FollowerRepository } from '@/follower/repositories/follower.repository';
import { FollowJobData } from '@/follower/interfaces/follower.interface';
import { FollowerDto } from '@/follower/dto/responses/follower.dto';

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
   * Stablish a relationship between two user where user follows followee
   * @param followeeId Followee id
   * @param userId User id
   * @param username User name (for notifications)
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

    // TODO: Send notification
  }

  /**
   * Break the relationship between two user where user follows followee
   * @param followeeId User id who is followed
   * @param userId User who follow
   */
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

  /**
   * Get users who passed user is following
   * @param userId User id
   * @returns Users who passed user is following
   */
  public async getFollowingUsers(userId: ID): Promise<FollowerDto[]> {
    const cachedFollowingUsers =
      await this.followerCacheService.getFollowingUsersFromCache(userId);

    const followingUsers = cachedFollowingUsers.length
      ? cachedFollowingUsers
      : await this.followerRepository.getFollowingUsers(userId);

    return followingUsers;
  }

  /**
   * Get users who follow passed user
   * @param userId User id
   * @returns User who follow passed user
   */
  public async getFollowers(userId: ID): Promise<FollowerDto[]> {
    const cachedFollowers =
      await this.followerCacheService.getFollowersFromCache(userId);

    const followers = cachedFollowers.length
      ? cachedFollowers
      : await this.followerRepository.getFollowers(userId);

    return followers;
  }

  /**
   * Check if user follows the followee user
   * @param userId User who follows id
   * @param followeeId User who is being followed id
   * @returns True if user follows the followee user, false otherwise
   */
  public async isFollowing(userId: ID, followeeId: ID): Promise<boolean> {
    return await this.followerRepository.isFollowing(userId, followeeId);
  }
}
