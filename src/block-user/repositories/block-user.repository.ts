import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { User } from '@/user/models/user.model';

@Injectable()
export class BlockUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Check is followee user has blocked user
   * @param userId User id to check if has been blocked
   * @param followeeId User id to check if has blocked user
   * @returns True if followee user has blocked user, false in otherwise
   */
  public async isUserBlockedBy(
    userId: ObjectId,
    followeeId: ObjectId,
  ): Promise<boolean> {
    return !!(await this.userModel.findOne({
      _id: userId,
      blockedBy: followeeId,
    }));
  }

  /**
   * Add block to users
   * @param userId User who block id
   * @param followerId User who will be blocked id
   */
  public async blockUser(
    userId: ObjectId,
    followerId: ObjectId,
  ): Promise<void> {
    // TODO: Use bulkwrite
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

  /**
   * Remove block for user
   * @param userId User who unblock id
   * @param followerId User who is blocked id
   */
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
