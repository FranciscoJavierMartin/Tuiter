import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  public async isFollowing(userId: ObjectId, followeeId: ObjectId) {
    return await this.followerModel.findOne({
      followeeId,
      followerId: userId,
    });
  }

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

  public async getFollowingUsers(userId: ObjectId): Promise<FollowerData[]> {
    return this.followerModel.aggregate([
      { $match: { followerId: new ObjectId(userId) } },
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
    ]);
  }
}
