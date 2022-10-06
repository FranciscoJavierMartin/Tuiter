import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserConsumer } from '@/user/consumer/user.consumer';
import { User, UserSchema } from '@/user/models/user.model';
import { UserService } from '@/user/services/user.service';
import { UserController } from '@/user/user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserConsumer],
  exports: [UserService, UserConsumer],
})
export class UserModule {}
