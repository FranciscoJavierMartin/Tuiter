import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationRepository } from '@/notification/repositories/notification.repository';

@Injectable()
export class IsReceiverGuard implements CanActivate {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  /**
   * Check if user is notification receiver
   * @param context Execution context
   * @returns True if user is notification receiver, false otherwise
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const notificationId = request.params.notificationId;
    const notification = await this.notificationRepository.getNotificationById(
      notificationId,
    );

    if (!notification) {
      throw new NotFoundException(
        `Notification with id ${notificationId} was not found`,
      );
    }

    return notification.userTo.toString() === request.user.userId;
  }
}
