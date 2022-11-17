import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// TODO: Add image, reaction
@Schema({
  collection: 'Message',
})
export class Message {
  _id: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
  })
  chatId: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  senderId: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  receiverId: ObjectId;

  @Prop({
    type: String,
    default: '',
  })
  text: string = '';

  @Prop({
    type: String,
    default: '',
  })
  gifUrl: string = '';

  @Prop({
    type: String,
    default: '',
  })
  imageUrl: string = '';

  @Prop({
    type: Boolean,
    default: false,
  })
  isRead: boolean = false;

  @Prop({
    type: Boolean,
    default: false,
  })
  deleteForMe: boolean = false;

  @Prop({
    type: Boolean,
    default: false,
  })
  deleteForEveryone: boolean = false;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date = new Date();
}

export const MessageSchema = SchemaFactory.createForClass(Message);
