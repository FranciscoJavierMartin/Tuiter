import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bull';
import { DEFAULT_JOB_OPTIONS } from '@/shared/contants';
import { FollowerModule } from '@/follower/follower.module';
import { BlockUserService } from '@/block-user/services/block-user.service';
import { BlockUserController } from '@/block-user/block-user.controller';
import { BlockUserCacheService } from '@/block-user/services/block-user.cache.service';
import { BlockUserConsumer } from '@/block-user/consumers/block-user.consumer';
import { BlockUserRepository } from '@/block-user/repositories/block-user.repository';
import { UserModule } from '@/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Follower, FollowerSchema } from '@/follower/models/follower.model';
import { User, UserSchema } from '@/user/models/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follower.name, schema: FollowerSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BullModule.registerQueue({
      name: 'blockuser',
      defaultJobOptions: DEFAULT_JOB_OPTIONS,
    }),
    forwardRef(() => FollowerModule),
    UserModule,
  ],
  controllers: [BlockUserController],
  providers: [
    BlockUserService,
    BlockUserCacheService,
    BlockUserConsumer,
    BlockUserRepository,
  ],
  exports: [BlockUserCacheService],
})
export class BlockUserModule {}
