import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { NotificationType } from '@/notification/interfaces/notification.interface';

@Schema({
  collection: 'Notification',
})
export class Notification {
  _id: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  })
  userTo: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userFrom: ObjectId;

  @Prop({ type: Boolean, default: false })
  read: boolean;

  @Prop({ type: String, default: '' })
  message: string;

  @Prop({ type: String, enum: NotificationType })
  notificationType: NotificationType;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  entityId: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  createdItemId: ObjectId;

  @Prop({
    type: String,
    default: '',
  })
  text: string;

  @Prop({
    type: String,
    default: '',
  })
  imgId: string;

  @Prop({
    type: String,
    default: '',
  })
  imgVersion: string;

  @Prop({
    type: String,
    default: '',
  })
  gifUrl: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date = new Date();
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
