import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserConsumer } from './consumer/user.consumer';
import { User, UserSchema } from './models/user.model';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserConsumer],
  exports: [UserService, UserConsumer],
})
export class UserModule {}
