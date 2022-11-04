import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { getQueues } from '@/helpers/utils';
import { NotificationService } from '@/notification/notification.service';
import { NotificationController } from '@/notification/notification.controller';
import { NotificationRepository } from '@/notification/repositories/notification.repository';
import {
  Notification,
  NotificationSchema,
} from '@/notification/models/notification.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    BullModule.registerQueue(...getQueues('email')),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationService],
})
export class NotificationModule {}
