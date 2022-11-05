import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { NotificationService } from '@/notification/notification.service';
import { NotificationDto } from '@/notification/dto/reponses/notification.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieve alll user notifications',
    type: [NotificationDto],
  })
  @UseGuards(AuthGuard())
  public async getNotifications(
    @GetUser('userId') [userId]: string,
  ): Promise<NotificationDto[]> {
    return await this.notificationService.getNotifications(userId);
  }
}
