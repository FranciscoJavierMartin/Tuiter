import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class NotMySelfGuard implements CanActivate {
  /**
   * Check if current user is the follower or the followee user
   * @param context
   * @returns True if current user is not the follower or the followee user, false otherwise
   */
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const followeeId = request.params.followeeId;
    const followerId = request.params.followerId;
    const userId = request.user.userId;

    return !(
      (followeeId && followeeId === userId) ||
      (followerId && followerId === userId)
    );
  }
}
