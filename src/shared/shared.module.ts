import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserCacheService } from './redis/user.cache.service';

@Module({
  imports: [ConfigModule],
  providers: [UserCacheService],
  exports: [UserCacheService],
})
export class SharedModule {}
