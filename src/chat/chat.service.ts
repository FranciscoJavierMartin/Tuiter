import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { AddMessageDto } from '@/chat/dto/requests/add-message.dto';
import { MessageData } from '@/chat/interfaces/chat.interface';
import { ID } from '@/shared/interfaces/types';

@Injectable()
export class ChatService {
  public async addMessage(
    receiverId: ID,
    addMessageDto: AddMessageDto,
    currentUser: CurrentUser,
    image?: Express.Multer.File,
  ): Promise<void> {
    // TODO: Add upload image feature
    // const messageData: MessageData = {
    //   _id: new ObjectId(),
    // };
  }
}
