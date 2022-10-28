import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { Feelings } from '@/reaction/interfaces/reaction.interface';

@Schema({
  collection: 'Reaction',
})
export class Reaction {
  _id: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    index: true,
  })
  postId: mongoose.Types.ObjectId;

  @Prop({ type: String, enum: Feelings })
  feeling: Feelings;

  @Prop({ Type: String, index: true, required: true })
  username: string;

  @Prop({ type: String, required: true })
  avatarColor: string = '';

  @Prop({ type: String })
  profilePicture: string = '';

  @Prop({ type: Date, default: Date.now })
  createdAt: Date = new Date();
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);

ReactionSchema.index(
  {
    postId: 1,
    username: 1,
  },
  { unique: true },
);
