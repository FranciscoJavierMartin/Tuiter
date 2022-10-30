import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowerService } from '@/follower/services/follower.service';
import { FollowerController } from '@/follower/follower.controller';
import { Follower, FollowerSchema } from '@/follower/models/follower.model';
import { FollowerCacheService } from './services/follower.cache.service';
import { BlockUserCacheService } from './services/block-user.cache.service';
import { BlockUserRepository } from './repositories/block-user.repository';
import { UserModule } from '@/user/user.module';
import { User, UserSchema } from '@/user/models/user.model';
import { FollowerRepository } from './repositories/follower.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follower.name, schema: FollowerSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
  ],
  controllers: [FollowerController],
  providers: [
    FollowerService,
    FollowerCacheService,
    BlockUserCacheService,
    BlockUserRepository,
    FollowerRepository,
  ],
})
export class FollowerModule {}
