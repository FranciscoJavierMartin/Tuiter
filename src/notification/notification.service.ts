import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { NotificationRepository } from '@/notification/repositories/notification.repository';
import { NotificationBody } from '@/notification/interfaces/notification.interface';
import { NotificationDto } from '@/notification/dto/reponses/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
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
}
