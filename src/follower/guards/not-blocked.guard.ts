import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BlockUserRepository } from '@/follower/repositories/block-user.repository';

@Injectable()
export class NotBlockedGuard implements CanActivate {
  constructor(private readonly blockUserRepository: BlockUserRepository) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const followeeId = request.params.followeeId;
    const userId = request.user.userId;

    return !(await this.blockUserRepository.isUserBlockedBy(
      userId,
      followeeId,
    ));
  }
}
