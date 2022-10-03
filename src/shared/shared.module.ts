import { Module } from '@nestjs/common';
import { UserCacheService } from './redis/user.cache.service';

@Module({
  providers: [UserCacheService],
  exports: [UserCacheService],
})
export class SharedModule {}
