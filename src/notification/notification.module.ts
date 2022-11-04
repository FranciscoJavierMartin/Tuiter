import { Module } from '@nestjs/common';
import { NotificationService } from '@/notification/notification.service';
import { NotificationController } from '@/notification/notification.controller';
import { NotificationRepository } from '@/notification/repositories/notification.repository';
import {
  Notification,
  NotificationSchema,
} from '@/notification/models/notification.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService],
})
export class NotificationModule {}
