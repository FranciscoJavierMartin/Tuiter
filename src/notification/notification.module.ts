import { Module } from '@nestjs/common';
import { NotificationService } from '@/notification/notification.service';
import { NotificationController } from '@/notification/notification.controller';
import { NotificationRepository } from '@/notification/repositories/notification.repository';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
})
export class NotificationModule {}
