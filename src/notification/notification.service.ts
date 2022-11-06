import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { ObjectId } from 'mongodb';
import { Queue } from 'bull';
import { ID } from '@/shared/interfaces/types';
import { NotificationRepository } from '@/notification/repositories/notification.repository';
import {
  NotificationBody,
  NotificationJobData,
} from '@/notification/interfaces/notification.interface';
import { NotificationDto } from '@/notification/dto/reponses/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    @InjectQueue('notification')
    private readonly notificationQueue: Queue<NotificationJobData>,
  ) {}

  /**
   * Insert notification in DB, then retrieve all notifications from receiver
   * @param notificationBody Notification info to be added to DB
   * @returns All notifications from the same receiver as the created
   */
  public async insertNotification(
    notificationBody: NotificationBody,
  ): Promise<NotificationDto[]> {
    await this.notificationRepository.create(notificationBody);
    return await this.getNotifications(notificationBody.userTo.toString());
  }

  /**
   * Get all notifications from receiver id
   * @param userId Receiver id
   * @returns All notifications from receiver id
   */
  public async getNotifications(userId: string): Promise<NotificationDto[]> {
    return await this.notificationRepository.getNotifications(
      new ObjectId(userId),
    );
  }

  /**
   * Mark as read the notification
   * @param notificationId Notification id
   */
  public async updateNotification(notificationId: ID): Promise<void> {
    // TODO: Emit 'update notification'

    this.notificationQueue.add('updateNotification', {
      notificationId,
    });
  }

  /**
   * Remove notification
   * @param notificationId Notification id
   */
  public async removeNotification(notificationId: ID): Promise<void> {
    // TODO: Emit 'remove notification'

    this.notificationQueue.add('removeNotification', {
      notificationId,
    });
  }
}
