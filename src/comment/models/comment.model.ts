import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Schema({
  collection: 'Comment',
})
export class Comment {
  _id: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    index: true,
  })
  postId: mongoose.Types.ObjectId;

  @Prop({ type: String, default: '' })
  text: string;

  @Prop({ Type: String, required: true })
  username: string;

  @Prop({ Type: String, required: true })
  avatarColor: string;

  @Prop({ Type: String })
  profilePicture: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date = new Date();
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
