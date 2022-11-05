import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { EmailService } from '@/email/services/email.service';
import { NotificationService } from '@/notification/notification.service';
import { NotificationType } from '@/notification/interfaces/notification.interface';
import { UserRepository } from '@/user/repositories/user.repository';
import { Follower } from '@/follower/models/follower.model';
import { FollowerDto } from '@/follower/dto/responses/follower.dto';

@Injectable()
export class FollowerRepository {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService,
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
      // TODO: Return updated documents (Performance consideration)
      this.userRepository.updateUserFollowersCount(userId, followeeId, 1),
    ]);

    const followeeUser = await this.userRepository.getUserById(followeeId);
    const followerUser = await this.userRepository.getUserById(userId);

    if (followeeUser.notifications.follows && userId !== followeeId) {
      this.notificationService.insertNotification({
        userFrom: userId,
        userTo: followeeId,
        message: `${followerUser.username} is now following you`,
        notificationType: NotificationType.follows,
        entityId: userId,
        createdItemId: followeeId,
        createdAt: new Date(),
        text: '',
        imgId: '',
        imgVersion: '',
        gifUrl: '',
      });

      this.emailService.sendNotificationEmail(
        followeeUser.email,
        `${followerUser.username} is now following you`,
        followeeUser.username,
        `${followerUser.username} is now following you`,
        'Follower notification',
      );
    }
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
  public async getFollowingUsers(userId: ObjectId): Promise<FollowerDto[]> {
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
          postsCount: '$followeeId.postsCount',
          followersCount: '$followeeId.followersCount',
          followingCount: '$followeeId.followingCount',
          profilePicture: '$followeeId.profilePicture',
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

  /**
   * Get users who follow passed user
   * @param userId User id
   * @returns User followers
   */
  public async getFollowers(userId: ObjectId): Promise<FollowerDto[]> {
    return this.followerModel.aggregate([
      { $match: { followeeId: new ObjectId(userId) } },
      {
        $lookup: {
          from: 'User',
          localField: 'followerId',
          foreignField: '_id',
          as: 'followerId',
        },
      },
      { $unwind: '$followerId' },
      {
        $lookup: {
          from: 'Auth',
          localField: 'followerId.authId',
          foreignField: '_id',
          as: 'authId',
        },
      },
      { $unwind: '$authId' },
      {
        $addFields: {
          _id: '$followerId._id',
          username: '$authId.username',
          avatarColor: '$authId.avatarColor',
          uId: '$authId.uId',
          postsCount: '$followerId.postsCount',
          followersCount: '$followerId.followersCount',
          followingCount: '$followerId.followingCount',
          profilePicture: '$followerId.profilePicture',
          userProfile: '$followerId',
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
