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
import { PassportModule } from '@nestjs/passport';
import { NotificationConsumer } from '@/notification/consumers/notification.consumer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BullModule.registerQueue(...getQueues('notification', 'email')),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationRepository,
    NotificationConsumer,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
