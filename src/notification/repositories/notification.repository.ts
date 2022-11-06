import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { NotificationBody } from '@/notification/interfaces/notification.interface';
import { Notification } from '@/notification/models/notification.model';
import { NotificationDto } from '@/notification/dto/reponses/notification.dto';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  /**
   * Add notification to DB
   * @param body Notification info to be added
   */
  public async create(body: NotificationBody): Promise<void> {
    await this.notificationModel.create(body);
  }

  /**
   * Retrieve all notifications from DB given receiver id
   * @param userId Receiver id
   * @returns All notification where receiver id is equals to passed
   */
  public async getNotifications(userId: ObjectId): Promise<NotificationDto[]> {
    return await this.notificationModel.aggregate([
      { $match: { userTo: userId } },
      {
        $lookup: {
          from: 'User',
          localField: 'userFrom',
          foreignField: '_id',
          as: 'userFrom',
        },
      },
      {
        $unwind: '$userFrom',
      },
      {
        $lookup: {
          from: 'Auth',
          localField: 'userFrom.authId',
          foreignField: '_id',
          as: 'authId',
        },
      },
      {
        $unwind: '$authId',
      },
      {
        $project: {
          _id: 1,
          message: 1,
          comment: 1,
          createdAt: 1,
          createdItemId: 1,
          entityId: 1,
          notificationType: 1,
          gifUrl: 1,
          imgId: 1,
          imgVersion: 1,
          post: 1,
          reaction: 1,
          read: 1,
          userTo: 1,
          userFrom: {
            profilePicture: '$userFrom.profilePicture',
            username: '$authId.username',
            avatarColor: '$authId.avatarColor',
            uId: '$authId.uId',
          },
        },
      },
    ]);
  }

  /**
   * Retrieve single notification filtering by id from DB
   * @param notificationId Notification id
   * @returns Notification
   */
  public async getNotificationById(
    notificationId: ObjectId,
  ): Promise<Notification> {
    return await this.notificationModel.findById(notificationId);
  }

  /**
   * Mark as read notifiaction in DB
   * @param notificationId Notification id
   */
  public async updateNotification(notificationId: ObjectId): Promise<void> {
    await this.notificationModel
      .findByIdAndUpdate(notificationId, {
        $set: { read: true },
      })
      .exec();
  }

  /**
   * Remove notification from DB
   * @param notificationId Notification id
   */
  public async removeNotification(notificationId: ObjectId): Promise<void> {
    await this.notificationModel.findByIdAndRemove(notificationId).exec();
  }
}
