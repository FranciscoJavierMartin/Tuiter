import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { AddMessageDto } from '@/chat/dto/requests/add-message.dto';
import { MessageData } from '@/chat/interfaces/chat.interface';
import { ID } from '@/shared/interfaces/types';
import { UploaderService } from '@/shared/services/uploader.service';
import { UserCacheService } from '@/user/services/user.cache.service';
import { ChatCacheService } from '@/chat/repositories/chat.cache.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly uploaderService: UploaderService,
    private readonly userCacheService: UserCacheService,
    private readonly chatCacheService: ChatCacheService,
  ) {}

  public async addMessage(
    receiverId: ID,
    addMessageDto: AddMessageDto,
    currentUser: CurrentUser,
    image?: Express.Multer.File,
  ): Promise<void> {
    // TODO: Upload image

    // TODO: Search if chat exists between two users
    const chatId = new ObjectId();

    const [sender, receiver] = await Promise.all([
      await this.userCacheService.getUserFromCache(currentUser.userId),
      await this.userCacheService.getUserFromCache(receiverId),
    ]);

    // TODO: Pass proper data
    this.emitSocketIOEvent(undefined);

    await Promise.all([
      await this.chatCacheService.addChatToCache(
        currentUser.userId,
        receiverId,
        chatId,
      ),
      await this.chatCacheService.addChatToCache(
        receiverId,
        currentUser.userId,
        chatId,
      ),
      await this.chatCacheService.addMessageToCache(chatId),
    ]);
  }

  private emitSocketIOEvent(data: any): void {
    // TODO: Emit 'message received' and 'chat list'
  }
}
