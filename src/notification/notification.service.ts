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

  public async insertNotification(
    notificationBody: NotificationBody,
  ): Promise<NotificationDto[]> {
    await this.notificationRepository.create(notificationBody);
    return await this.notificationRepository.getNotifications(
      notificationBody.userTo,
    );
  }

  public async getNotifications(userId: string): Promise<NotificationDto[]> {
    return await this.notificationRepository.getNotifications(
      new ObjectId(userId),
    );
  }

  public async updateNotification(notificationId: ID): Promise<void> {
    // TODO: Emit 'update notification'

    this.notificationQueue.add('updateNotification', {
      id: notificationId,
    });
  }
}
