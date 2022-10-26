import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Reactions } from '@/reaction/interfaces/reaction.interface';
import { Privacy } from '@/post/interfaces/post.interface';

@Schema({
  collection: 'Post',
})
export class Post {
  _id: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  })
  authorId: string | mongoose.Types.ObjectId;

  @Prop({ Type: String, required: true })
  username: string;

  @Prop({ Type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  avatarColor: string = '';

  @Prop({ type: String })
  profilePicture: string = '';

  @Prop({ type: String, default: '' })
  text: string = '';

  @Prop({ type: String, default: '' })
  bgColor: string;

  @Prop({ type: String, default: '' })
  imgVersion: string = '';

  @Prop({ type: String, default: '' })
  imgId: string = '';

  @Prop({ type: String, default: '' })
  feelings: string = '';

  @Prop({ type: String, default: '' })
  gifUrl: string = '';

  @Prop({ type: String, enum: Privacy })
  privacy: Privacy;

  @Prop({ type: Number, default: 0 })
  commentsCount: number = 0;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date = new Date();

  @Prop(
    raw({
      angry: { type: Number, default: 0 },
      happy: { type: Number, default: 0 },
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      sad: { type: Number, default: 0 },
      wow: { type: Number, default: 0 },
    }),
  )
  reactions: Reactions;
}

export const PostSchema = SchemaFactory.createForClass(Post);
