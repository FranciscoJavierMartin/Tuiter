import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from '@/shared/interfaces/types';
import { Follower } from '@/follower/models/follower.model';

@Injectable()
export class FollowerRepository {
  constructor(
    @InjectModel(Follower.name) private followerModel: Model<Follower>,
  ) {}

  public async isFollowing(userId: ID, followeeId: ID) {
    return await this.followerModel.findOne({
      followeeId,
      followerId: userId,
    });
  }
}
