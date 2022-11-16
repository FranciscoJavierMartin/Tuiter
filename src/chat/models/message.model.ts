import { Prop, Schema } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Schema({
  collection: 'Message',
})
export class Message {
  _id: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
  })
  conversationId: ObjectId;
}
