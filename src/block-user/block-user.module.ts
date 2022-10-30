import { Module } from '@nestjs/common';
import { BlockUserService } from '@/block-user/services/block-user.service';
import { BlockUserController } from '@/block-user/block-user.controller';
import { PassportModule } from '@nestjs/passport';
import { BlockUserCacheService } from './services/block-user.cache.service';
import { FollowerModule } from '@/follower/follower.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    FollowerModule,
  ],
  controllers: [BlockUserController],
  providers: [BlockUserService, BlockUserCacheService],
  exports: [BlockUserCacheService],
})
export class BlockUserModule {}
