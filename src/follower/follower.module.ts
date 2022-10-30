import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { DEFAULT_JOB_OPTIONS } from '@/shared/contants';
import { UserModule } from '@/user/user.module';
import { BlockUserModule } from '@/block-user/block-user.module';
import { FollowerService } from '@/follower/services/follower.service';
import { FollowerController } from '@/follower/follower.controller';
import { Follower, FollowerSchema } from '@/follower/models/follower.model';
import { FollowerCacheService } from '@/follower/services/follower.cache.service';
import { BlockUserRepository } from '@/follower/repositories/block-user.repository';
import { User, UserSchema } from '@/user/models/user.model';
import { FollowerRepository } from '@/follower/repositories/follower.repository';
import { FollowerConsumer } from '@/follower/consumers/follower.consumer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follower.name, schema: FollowerSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BullModule.registerQueue({
      name: 'follower',
      defaultJobOptions: DEFAULT_JOB_OPTIONS,
    }),
    UserModule,
    BlockUserModule,
  ],
  controllers: [FollowerController],
  providers: [
    FollowerService,
    FollowerCacheService,
    BlockUserRepository,
    FollowerRepository,
    FollowerConsumer,
  ],
  exports: [FollowerService, FollowerRepository],
})
export class FollowerModule {}
