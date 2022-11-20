import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class NotMySelfGuard implements CanActivate {
  // TODO: Refactor to check differents properties (followers, chat, etc)
  /**
   * Check if current user is the message receiver
   * @param context
   * @returns True if current user is not the message receiver, false otherwise
   */
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const receiverId = request.params.receiverId;
    const userId = request.user.userId;

    return receiverId !== userId;
  }
}
