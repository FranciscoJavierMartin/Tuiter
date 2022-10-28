import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Schema({
  collection: 'User',
})
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Auth', index: true })
  authId: ObjectId;

  @Prop({ type: String, default: '' })
  profilePicture: string;

  @Prop({
    type: Number,
    default: 0,
  })
  postsCount: number;

  @Prop({
    type: Number,
    default: 0,
  })
  followersCount: number;

  @Prop({
    type: Number,
    default: 0,
  })
  followingCount: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  blocked: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  blockedBy: string[];

  @Prop(
    raw({
      messages: { type: Boolean, default: true },
      reactions: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
      follows: { type: Boolean, default: true },
    }),
  )
  notifications: Record<string, boolean>;

  @Prop(
    raw({
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    }),
  )
  social: Record<string, string>;

  @Prop({
    type: String,
    default: '',
  })
  work: string;

  @Prop({
    type: String,
    default: '',
  })
  school: string;

  @Prop({
    type: String,
    default: '',
  })
  location: string;

  @Prop({
    type: String,
    default: '',
  })
  quote: string;

  @Prop({
    type: String,
    default: '',
  })
  bgImageVersion: string;

  @Prop({
    type: String,
    default: '',
  })
  bgImageId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User &
  Document & {
    _id: ObjectId | string;
    username?: string;
    email?: string;
    password?: string;
    avatarColor?: string;
    uId?: string;
    createdAt?: Date;
  };
