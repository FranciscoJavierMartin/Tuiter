import { BlockUserCacheService } from '@/block-user/services/block-user.cache.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class NotBlockedGuard implements CanActivate {
  constructor(private readonly blockUserCacheService: BlockUserCacheService) {}

  public async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const receiverId = request.params.receiverId;
    console.log('ReceiverId', request);
    const userId = request.user.userId;

    // const isBlockedBy = await this.blockUserCacheService.isUserBlockedBy(
    //   receiverId,
    //   userId,
    // );

    // return !isBlockedBy;

    return true;
  }
}
