import { Module } from '@nestjs/common';
import { UserCacheService } from '../user/services/user.cache.service';

@Module({
  imports: [],
  providers: [UserCacheService],
  exports: [UserCacheService],
})
export class SharedModule {}
