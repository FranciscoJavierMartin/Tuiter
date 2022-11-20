import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { ObjectId } from 'mongodb';
import { UploadApiResponse } from 'cloudinary';
import { Queue } from 'bull';
import { ID } from '@/shared/interfaces/types';
import { UploaderService } from '@/shared/services/uploader.service';
import { ImageJobData } from '@/image/interfaces/image.interface';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { UserCacheService } from '@/user/services/user.cache.service';
import { AddMessageDto } from '@/chat/dto/requests/add-message.dto';
import {
  MessageDocument,
  MessageJobData,
} from '@/chat/interfaces/chat.interface';
import { ChatCacheService } from '@/chat/repositories/chat.cache.service';
import { AddReactionDto } from '@/chat/dto/requests/add-reaction.dto';
import { RemoveReactionDto } from '@/chat/dto/requests/remove-reaction.dto';
import { MarkAsReadDto } from '@/chat/dto/requests/mark-as-read.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly uploaderService: UploaderService,
    private readonly userCacheService: UserCacheService,
    private readonly chatCacheService: ChatCacheService,
    @InjectQueue('chat')
    private readonly chatQueue: Queue<MessageJobData>,
    @InjectQueue('image')
    private readonly imageQueue: Queue<ImageJobData>,
  ) {}

  public async addMessage(
    receiverId: ID,
    addMessageDto: AddMessageDto,
    currentUser: CurrentUser,
    image?: Express.Multer.File,
  ): Promise<void> {
    const chatId: ID = new ObjectId(
      (await this.chatCacheService.getUserChat(currentUser.userId, receiverId))
        ?.chatId ?? new ObjectId(),
    );

    const receiver = await this.userCacheService.getUserFromCache(receiverId);

    // TODO: Check if should be added first to DB to avoid create ID first
    const message: MessageDocument = {
      _id: new ObjectId(),
      chatId,
      createdAt: new Date(),
      deleteForEveryone: false,
      deleteForMe: false,
      gifUrl: addMessageDto.gifUrl,
      imageUrl: '',
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

    if (image) {
      try {
        const imageUploaded: UploadApiResponse =
          await this.uploaderService.uploadImage(image);

        message.imageUrl = this.uploaderService.getImageUrl(
          imageUploaded.version,
          imageUploaded.public_id,
        );

        this.imageQueue.add('addImageToDb', {
          ownerId: currentUser.userId,
          imgId: imageUploaded.public_id,
          imgVersion: imageUploaded.version.toString(),
        });
      } catch (error) {
        throw new BadGatewayException('External server error');
      }
    }

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

    this.chatQueue.add('addMessageToDB', message);
  }

  public async addReaction(addReactionDto: AddReactionDto): Promise<void> {
    await this.chatCacheService.addReactionToCache(
      addReactionDto.chatId,
      addReactionDto.messageId,
      addReactionDto.feeling,
    );

    this.chatQueue.add('addReactionToMessage', {
      messageId: addReactionDto.messageId,
      feeling: addReactionDto.feeling,
    });
  }

  public async removeReaction(
    removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    await this.chatCacheService.removeReactionFromCache(
      removeReactionDto.chatId,
      removeReactionDto.messageId,
    );

    this.chatQueue.add(
      'removeReactionFromMessage',
      removeReactionDto.messageId,
    );
  }

  public async markAsRead(markAsReadDto: MarkAsReadDto): Promise<void> {
    // TODO: Needs chatId
    // await this.chatCacheService.markMessagesAsRead()
    // TODO: Emit 'message read'
    // TODO: Emit 'chat list'
    // this.chatQueue.add('')
  }

  private emitSocketIOEvent(data: MessageDocument): void {
    // TODO: Emit 'message received' and 'chat list'
  }
}
