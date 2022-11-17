import { Module } from '@nestjs/common';
import { ChatService } from '@/chat/chat.service';
import { ChatController } from '@/chat/chat.controller';
import { PassportModule } from '@nestjs/passport';
import { BlockUserModule } from '@/block-user/block-user.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BlockUserModule,
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
