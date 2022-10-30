import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from '@/shared/interfaces/types';
import { Follower } from '@/follower/models/follower.model';
import { UserRepository } from '@/user/repositories/user.repository';

@Injectable()
export class FollowerRepository {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectModel(Follower.name) private followerModel: Model<Follower>,
  ) {}

  public async isFollowing(userId: ID, followeeId: ID) {
    return await this.followerModel.findOne({
      followeeId,
      followerId: userId,
    });
  }

  public async saveFollowerInDB(userId: ID, followeeId: ID) {
    // TODO: Check how to do with BulkWrite
    await Promise.all([
      this.followerModel.create({
        followeeId,
        followerId: userId,
      }),
      this.userRepository.updateUserFollowersCount(userId, followeeId, 1),
    ]);
  }
}
