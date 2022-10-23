import { Feelings } from '@/post/interfaces/post.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Schema({
  collection: 'Reaction',
})
export class Reaction {
  _id: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  })
  postId: string | mongoose.Types.ObjectId;

  @Prop({ type: String, enum: Feelings })
  feeling: Feelings;

  @Prop({ Type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  avatarColor: string = '';

  @Prop({ type: String })
  profilePicture: string = '';

  @Prop({ type: Date, default: Date.now })
  createdAt: Date = new Date();
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
