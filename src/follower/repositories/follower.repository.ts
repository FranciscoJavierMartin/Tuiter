import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserRepository } from '@/user/repositories/user.repository';
import { Follower } from '@/follower/models/follower.model';
import { FollowerData } from '@/follower/interfaces/follower.interface';

@Injectable()
export class FollowerRepository {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectModel(Follower.name) private followerModel: Model<Follower>,
  ) {}

  /**
   * Check if user follows the followee user
   * @param userId User who follows id
   * @param followeeId User who is being followed id
   * @returns True if user follows the followee user, false otherwise
   */
  public async isFollowing(
    userId: ObjectId,
    followeeId: ObjectId,
  ): Promise<boolean> {
    return !!(await this.followerModel.findOne({
      followeeId,
      followerId: userId,
    }));
  }

  /**
   * Save follow in DB and update followers count
   * @param userId User who follow id
   * @param followeeId User who is being followed id
   */
  public async saveFollowerInDB(
    userId: ObjectId,
    followeeId: ObjectId,
  ): Promise<void> {
    // TODO: Check how to do with BulkWrite
    await Promise.all([
      this.followerModel.create({
        followeeId,
        followerId: userId,
      }),
      this.userRepository.updateUserFollowersCount(userId, followeeId, 1),
    ]);
  }

  /**
   * Remove follow in DB and update followers count
   * @param userId User who follow id
   * @param followeeId User who is being followed id
   */
  public async removeFollowerFromDB(
    userId: ObjectId,
    followeeId: ObjectId,
  ): Promise<void> {
    // TODO: Check how to do with BulkWrite
    await Promise.all([
      this.followerModel.findOneAndRemove({
        followeeId,
        followerId: userId,
      }),
      this.userRepository.updateUserFollowersCount(userId, followeeId, -1),
    ]);
  }

  /**
   * Get users who user is following
   * @param userId User id
   * @returns Following users
   */
  public async getFollowingUsers(userId: ObjectId): Promise<FollowerData[]> {
    return this.followerModel.aggregate([
      { $match: { followerId: new ObjectId(userId) } },
      ...this.getSchemaDataForFollowers(),
    ]);
  }

  /**
   * Get users who follow passed user
   * @param userId User id
   * @returns User followers
   */
  public async getFollowers(userId: ObjectId): Promise<FollowerData[]> {
    return this.followerModel.aggregate([
      { $match: { followeeId: new ObjectId(userId) } },
      ...this.getSchemaDataForFollowers(),
    ]);
  }

  /**
   * Get schema data
   * @returns Schama data
   */
  private getSchemaDataForFollowers(): PipelineStage[] {
    return [
      {
        $lookup: {
          from: 'User',
          localField: 'followeeId',
          foreignField: '_id',
          as: 'followeeId',
        },
      },
      { $unwind: '$followeeId' },
      {
        $lookup: {
          from: 'Auth',
          localField: 'followeeId.authId',
          foreignField: '_id',
          as: 'authId',
        },
      },
      { $unwind: '$authId' },
      {
        $addFields: {
          _id: '$followeeId._id',
          username: '$authId.username',
          avatarColor: '$authId.avatarColor',
          uId: '$authId.uId',
          postCount: '$authId.postsCount',
          followersCount: '$authId.followersCount',
          followingCount: '$authId.followingCount',
          profilePicture: '$authId.profilePicture',
          userProfile: '$followeeId',
        },
      },
      {
        $project: {
          authId: 0,
          followerId: 0,
          followeeId: 0,
          createdAt: 0,
          __v: 0,
        },
      },
    ];
  }
}
