import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { getQueues } from '@/helpers/utils';
import { BlockUserModule } from '@/block-user/block-user.module';
import { UserModule } from '@/user/user.module';
import { ChatController } from '@/chat/chat.controller';
import { ChatService } from '@/chat/chat.service';
import { ChatCacheService } from '@/chat/repositories/chat.cache.service';
import { Chat, ChatSchema } from '@/chat/models/chat.model';
import { MessageSchema } from '@/chat/models/message.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Chat.name, schema: MessageSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BullModule.registerQueue(...getQueues('image')),
    BlockUserModule,
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatCacheService],
})
export class ChatModule {}
