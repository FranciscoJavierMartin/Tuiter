import { ID } from '@/shared/interfaces/types';
import { Injectable } from '@nestjs/common';
import { BlockUserCacheService } from '@/block-user/services/block-user.cache.service';

@Injectable()
export class BlockUserService {
  constructor(private readonly blockUserCacheService: BlockUserCacheService) {}

  public async block(userId: ID, followerId: ID) {}
}
