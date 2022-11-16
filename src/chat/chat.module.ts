import { Module } from '@nestjs/common';
import { ChatService } from '@/chat/chat.service';
import { ChatController } from '@/chat/chat.controller';
import { PassportModule } from '@nestjs/passport';
import { BlockUserModule } from '@/block-user/block-user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BlockUserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
