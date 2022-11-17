import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { AddMessageDto } from '@/chat/dto/requests/add-message.dto';
import { MessageDocument } from '@/chat/interfaces/chat.interface';
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

    // const chatId = new ObjectId();
    const chatId: ID = new ObjectId(
      (await this.chatCacheService.getUserChat(currentUser.userId, receiverId))
        ?.chatId ?? new ObjectId(),
    );

    const [sender, receiver] = await Promise.all([
      await this.userCacheService.getUserFromCache(currentUser.userId),
      await this.userCacheService.getUserFromCache(receiverId),
    ]);

    const message: MessageDocument = {
      _id: new ObjectId(),
      chatId,
      createdAt: new Date(),
      deleteForEveryone: false,
      deleteForMe: false,
      gifUrl: addMessageDto.gifUrl,
      isRead: false,
      receiverAvatarColor: receiver.avatarColor,
      receiverId,
      receiverProfilePicture: receiver.profilePicture,
      receiverUsername: receiver.username,
      senderAvatarColor: currentUser.avatarColor,
      senderId: currentUser.userId,
      senderProfilePicture: currentUser.profilePicture,
      senderUsername: currentUser.username,
      text: addMessageDto.text,
    };

    // TODO: Pass proper data
    this.emitSocketIOEvent(message);

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
      await this.chatCacheService.addMessageToCache(chatId, message),
    ]);
  }

  private emitSocketIOEvent(data: MessageDocument): void {
    // TODO: Emit 'message received' and 'chat list'
  }
}
