import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { NotificationService } from '@/notification/notification.service';
import { NotificationDto } from '@/notification/dto/reponses/notification.dto';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { ID } from '@/shared/interfaces/types';
import { IsReceiverGuard } from '@/notification/guards/is-receiver.guard';

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

  // Add Guard to check that is notification receiver
  @Patch(':notificationId')
  @ApiParam({
    name: 'notificationId',
    description: 'Notification id to be updated',
  })
  @ApiOkResponse({
    description: 'Mark notification as read',
  })
  @UseGuards(AuthGuard(), IsReceiverGuard)
  public async updateNotification(
    @Param('notificationId', ValidateIdPipe) notificationId: ID,
  ): Promise<void> {
    this.notificationService.updateNotification(notificationId);
  }
}
