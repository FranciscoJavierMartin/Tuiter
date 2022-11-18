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
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  public async saveMessageToDB(data: MessageDocument): Promise<void> {
    if (!(await this.chatModel.exists({ _id: data.chatId }))) {
      await this.chatModel.create({
        _id: data.chatId,
        senderId: data.senderId,
        receiverId: data.receiverId,
      });
    }

    await this.messageModel.create({
      _id: data._id,
      chatId: data.chatId,
      createdAt: data.createdAt,
      deleteForEveryone: data.deleteForEveryone,
      deleteForMe: data.deleteForMe,
      gifUrl: data.gifUrl,
      imageUrl: data.imageUrl,
      isRead: data.isRead,
      receiverId: data.receiverId,
      senderId: data.senderId,
      text: data.text,
    });
  }
}