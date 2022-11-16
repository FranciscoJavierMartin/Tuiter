import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { AddMessageDto } from '@/chat/dto/requests/add-message.dto';
import { MessageData } from '@/chat/interfaces/chat.interface';

@Injectable()
export class ChatService {
  public async addMessage(
    addMessageDto: AddMessageDto,
    currentUser: CurrentUser,
  ) {
    // TODO: Add upload image feature
    // const messageData: MessageData = {
    //   _id: new ObjectId(),
      
    // };
  }
}
