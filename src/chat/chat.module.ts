import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BlockUserModule } from '@/block-user/block-user.module';
import { UserModule } from '@/user/user.module';
import { ChatController } from '@/chat/chat.controller';
import { ChatService } from '@/chat/chat.service';
import { ChatCacheService } from '@/chat/repositories/chat.cache.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BlockUserModule,
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatCacheService],
})
export class ChatModule {}
