import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationService } from '@/notification/notification.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/auth/decorators/get-user.decorator';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard())
  public async getNotifications(@GetUser('userId') [userId]: string) {
    // return this.notificationService.getNotifications(userId);
  }
}
