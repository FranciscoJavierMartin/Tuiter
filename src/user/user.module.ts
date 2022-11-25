import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserConsumer } from '@/user/consumers/user.consumer';
import { User, UserSchema } from '@/user/models/user.model';
import { UserService } from '@/user/services/user.service';
import { UserController } from '@/user/user.controller';
import { UserCacheService } from '@/user/services/user.cache.service';
import { UserRepository } from '@/user/repositories/user.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  // TODO: Add queues
  controllers: [UserController],
  providers: [UserService, UserConsumer, UserCacheService, UserRepository],
  exports: [UserService, UserConsumer, UserCacheService, UserRepository],
})
export class UserModule {}
