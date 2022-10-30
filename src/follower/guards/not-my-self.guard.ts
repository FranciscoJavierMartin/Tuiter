import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class NotMySelfGuard implements CanActivate {
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
