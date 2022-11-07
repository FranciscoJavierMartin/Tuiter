import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { NotificationService } from '@/notification/notification.service';
import { NotificationDto } from '@/notification/dto/reponses/notification.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  public async getNotifications(
    @GetUser('userId') userId: ID,
  ): Promise<NotificationDto[]> {
    return await this.notificationService.getNotifications(userId);
  }

  @Patch(':notificationId')
  @ApiParam({
    name: 'notificationId',
    description: 'Notification id to be updated',
  })
  @ApiOkResponse({
    description: 'Mark notification as read',
  })
  @ApiNotFoundResponse({
    description: 'Notification not found',
  })
  @ApiForbiddenResponse({
    description: 'User is not notification receiver',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), IsReceiverGuard)
  public async updateNotification(
    @Param('notificationId', ValidateIdPipe) notificationId: ID,
  ): Promise<void> {
    this.notificationService.updateNotification(notificationId);
  }

  @Delete(':notificationId')
  @ApiParam({
    name: 'notificationId',
    description: 'Notification id to be removed',
  })
  @ApiOkResponse({
    description: 'Remove notification',
  })
  @ApiNotFoundResponse({
    description: 'Notification not found',
  })
  @ApiForbiddenResponse({
    description: 'User is not notification receiver',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), IsReceiverGuard)
  public async removeNotification(
    @Param('notificationId', ValidateIdPipe) notificationId: ID,
  ): Promise<void> {
    this.notificationService.removeNotification(notificationId);
  }
}
