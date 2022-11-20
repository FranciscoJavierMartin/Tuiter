import { BlockUserCacheService } from '@/block-user/services/block-user.cache.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CanChatGuard implements CanActivate {
  constructor(private readonly blockUserCacheService: BlockUserCacheService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const receiverId = request.params.receiverId;
    const userId = request.user.userId;

    return (
      await Promise.all([
        this.blockUserCacheService.isUserBlockedBy(receiverId, userId),
        this.blockUserCacheService.isUserBlockedBy(userId, receiverId),
      ])
    ).some((isBlocked) => !isBlocked);
  }
}
