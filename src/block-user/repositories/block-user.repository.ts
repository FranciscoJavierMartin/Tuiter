import { User } from '@/user/models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlockUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async isUserBlockedBy(
    userId: ObjectId,
    followeeId: ObjectId,
  ): Promise<boolean> {
    return !!(await this.userModel.findOne({
      _id: userId,
      blockedBy: followeeId,
    }));
  }

  public async blockUser(
    userId: ObjectId,
    followerId: ObjectId,
  ): Promise<void> {
    await Promise.all([
      this.userModel.findOneAndUpdate(
        {
          _id: userId,
          blocked: { $ne: followerId },
        },
        {
          $push: {
            blocked: followerId,
          },
        },
      ),
      this.userModel.findOneAndUpdate(
        {
          _id: followerId,
          blockedBy: { $ne: userId },
        },
        {
          $push: {
            blockedBy: userId,
          },
        },
      ),
    ]);
  }

  public async unblockUser(
    userId: ObjectId,
    followerId: ObjectId,
  ): Promise<void> {
    await Promise.all([
      this.userModel.findOneAndUpdate(
        {
          _id: userId,
          blocked: followerId,
        },
        {
          $pull: {
            blocked: followerId,
          },
        },
      ),
      this.userModel.findOneAndUpdate(
        {
          _id: followerId,
          blockedBy: userId,
        },
        {
          $pull: {
            blockedBy: userId,
          },
        },
      ),
    ]);
  }
}
