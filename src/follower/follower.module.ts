import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { getQueues } from '@/helpers/utils';
import { EmailModule } from '@/email/email.module';
import { NotificationModule } from '@/notification/notification.module';
import { UserModule } from '@/user/user.module';
import { BlockUserModule } from '@/block-user/block-user.module';
import { FollowerService } from '@/follower/services/follower.service';
import { FollowerController } from '@/follower/follower.controller';
import { Follower, FollowerSchema } from '@/follower/models/follower.model';
import { FollowerCacheService } from '@/follower/services/follower.cache.service';
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
    BullModule.registerQueue(...getQueues('follower')),
    UserModule,
    BlockUserModule,
    NotificationModule,
    EmailModule,
  ],
  controllers: [FollowerController],
  providers: [
    FollowerService,
    FollowerCacheService,
    FollowerRepository,
    FollowerConsumer,
  ],
  exports: [FollowerService],
})
export class FollowerModule {}
