import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from '@/user/models/user.model';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Insert user in DB
   * @param data User to be created
   */
  public async addUserDataToDB(data: UserDocument): Promise<void> {
    const userCreated = new this.userModel({ ...data });
    await userCreated.save();
  }

  /**
   * Get user from DB (User collection)
   * @param userId user id
   * @returns User from DB
   */
  public async getUserById(userId: string): Promise<UserDocument> {
    const users: UserDocument[] = await this.userModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'Auth',
          localField: 'authId',
          foreignField: '_id',
          as: 'authId',
        },
      },
      { $unwind: '$authId' },
      { $project: this.aggregateProject() },
    ]);

    if (users.length === 0) {
      throw new NotFoundException('User not found');
    }

    return users[0];
  }

  /**
   * Get user from 'users' collection
   * @param authId Id from auth collection
   * @returns User from 'Users' collection
   */
  public async getUserByAuthId(authId: string): Promise<UserDocument> {
    const users: UserDocument[] = await this.userModel.aggregate([
      { $match: { authId: new mongoose.Types.ObjectId(authId) } },
      {
        $lookup: {
          from: 'Auth',
          localField: 'authId',
          foreignField: '_id',
          as: 'authId',
        },
      },
      { $unwind: '$authId' },
      { $project: this.aggregateProject() },
    ]);

    if (users.length === 0) {
      throw new NotFoundException('User not found');
    }

    return users[0];
  }

  public async updateUser(userId: string, user: User): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { $set: user });
  }

  // TODO: Refactor to include inside updateUser
  public async decrementUserPostsCount(userId: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $inc: { postsCount: -1 },
      })
      .exec();
  }

  /**
   * This is to select fields in projections
   * @returns Selected fields
   */
  private aggregateProject() {
    return {
      _id: 1,
      username: '$authId.username',
      uId: '$authId.uId',
      email: '$authId.email',
      avatarColor: '$authId.avatarColor',
      createdAt: '$authId.createdAt',
      postsCount: 1,
      work: 1,
      school: 1,
      quote: 1,
      location: 1,
      blocked: 1,
      blockedBy: 1,
      followersCount: 1,
      followingCount: 1,
      notifications: 1,
      social: 1,
      bgImageVersion: 1,
      bgImageId: 1,
      profilePicture: 1,
    };
  }
}
