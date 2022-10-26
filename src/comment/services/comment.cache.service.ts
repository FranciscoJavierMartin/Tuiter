import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseCache } from '@/shared/redis/base.cache';

@Injectable()
export class CommentCacheService extends BaseCache {
  constructor(configService: ConfigService) {
    super('CommentCache', configService);
  }

  public async savePostCommentToCache(): Promise<void> {}
}
