import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { AddMessageDto } from '@/chat/dto/requests/add-message.dto';
import { MessageData } from '@/chat/interfaces/chat.interface';
import { ID } from '@/shared/interfaces/types';
import { UploaderService } from '@/shared/services/uploader.service';
import { UserCacheService } from '@/user/services/user.cache.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly uploaderService: UploaderService,
    private readonly userCacheService: UserCacheService,
  ) {}

  public async addMessage(
    receiverId: ID,
    addMessageDto: AddMessageDto,
    currentUser: CurrentUser,
    image?: Express.Multer.File,
  ): Promise<void> {
    const [sender, receiver] = await Promise.all([
      await this.userCacheService.getUserFromCache(currentUser.userId),
      await this.userCacheService.getUserFromCache(receiverId),
    ]);

    this.emitSocketIOEvent(undefined);
  }

  private emitSocketIOEvent(data: any): void {
    // TODO: Emit 'message received' and 'chat list'
  }
}
