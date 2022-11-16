import { Module } from '@nestjs/common';
import { ChatService } from '@/chat/chat.service';
import { ChatController } from '@/chat/chat.controller';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
