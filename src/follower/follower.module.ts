import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowerService } from '@/follower/services/follower.service';
import { FollowerController } from '@/follower/follower.controller';
import { Follower, FollowerSchema } from '@/follower/models/follower.model';
import { FollowerCacheService } from './services/follower.cache.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follower.name, schema: FollowerSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [FollowerController],
  providers: [FollowerService, FollowerCacheService],
})
export class FollowerModule {}
