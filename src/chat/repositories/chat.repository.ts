import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from '@/chat/models/chat.model';
import { Message } from '@/chat/models/message.model';
import { MessageDocument } from '@/chat/interfaces/chat.interface';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Chat.name) private messageModel: Model<Message>,
  ) {}

  public async saveMessageToDB(data: MessageDocument): Promise<void> {
    if(await)
  }
}
