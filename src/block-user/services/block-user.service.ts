import { ID } from '@/shared/interfaces/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BlockUserCacheService } from '@/block-user/services/block-user.cache.service';

@Injectable()
export class BlockUserService {
  constructor(private readonly blockUserCacheService: BlockUserCacheService) {}

  public async block(userId: ID, followerId: ID) {
    if (await this.blockUserCacheService.isUserBlockedBy(userId, followerId)) {
      throw new BadRequestException('User is already blocked');
    }

    await this.blockUserCacheService.blockUser(userId, followerId);
  }
}
