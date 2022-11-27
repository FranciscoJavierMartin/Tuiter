import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { ID } from '@/shared/interfaces/types';
import { User, UserDocument } from '@/user/models/user.model';
import {
  NotificationSettings,
  SocialLinks,
} from '@/user/interfaces/user.interface';

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
  public async getUserById(userId: ID): Promise<UserDocument> {
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

  /**
   * Get user from DB (User collection)
   * @param username user name
   * @returns User from DB
   */
  public async getUserByUsername(username: string): Promise<UserDocument> {
    const users: UserDocument[] = await this.userModel.aggregate([
      { $match: { username } },
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
   * Get random users
   * @param userId User id to exclude
   * @param count Number of users to retrieved
   * @returns Random users from database
   */
  public async getRandomUsers(
    userId?: string,
    count: number = 10,
  ): Promise<UserDocument[]> {
    const users: UserDocument[] = await this.userModel.aggregate([
      { $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } } },
      { $sample: { size: count } },
      {
        $lookup: {
          from: 'Auth',
          localField: 'authId',
          foreignField: '_id',
          as: 'authId',
        },
      },
      { $unwind: '$authId' },
      {
        $addFields: {
          username: '$authId.username',
          email: '$authId.email',
          avatarColor: '$authId.avatarColor',
          uId: '$authId.uId',
          createdAt: '$authId.createdAt',
        },
      },
      {
        $project: {
          authId: 0,
          __v: 0,
        },
      },
    ]);

    return users;
  }

  /**
   * Update User in DB
   * @param userId User id
   * @param user User data
   */
  public async updateUser(
    userId: ObjectId,
    user: Partial<User>,
  ): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { $set: user });
  }

  // TODO: Refactor to include inside updateUser
  /**
   * Decrement (in one) user post count
   * @param userId User id
   */
  public async decrementUserPostsCount(userId: ID): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $inc: { postsCount: -1 },
      })
      .exec();
  }

  /**
   * Update users follower and following count
   * @param followerId Follower id
   * @param followeeId Followee id
   * @param increment Amount to increment
   */
  public async updateUserFollowersCount(
    followerId: ObjectId,
    followeeId: ObjectId,
    increment: number,
  ): Promise<void> {
    await Promise.all([
      this.userModel.findByIdAndUpdate(followerId, {
        $inc: {
          followingCount: increment,
        },
      }),
      this.userModel.findByIdAndUpdate(followeeId, {
        $inc: {
          followersCount: increment,
        },
      }),
    ]);
  }

  /**
   * Update social links
   * @param userId User id
   * @param socialLinks Social links
   */
  public async updateSocialLinks(
    userId: ObjectId,
    socialLinks: SocialLinks,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);
    user.social = {
      ...user.social,
      ...socialLinks,
    };
    await user.save();
  }

  /**
   * Update notification settings
   * @param userId User id
   * @param notificationSettings Notification settings
   */
  public async updateNotificationSettings(
    userId: ObjectId,
    notificationSettings: NotificationSettings,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);
    user.notifications = {
      ...user.notifications,
      ...notificationSettings,
    };
    await user.save();
  }

  /**
   * This is to select fields in projections
   * @returns Selected fields
   */
  private aggregateProject(): { [key: string]: string | number } {
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
