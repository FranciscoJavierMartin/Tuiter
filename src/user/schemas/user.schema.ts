import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

// export type UserDocument = User & Document;

export interface UserDocument extends Document {
  _id: string | ObjectId;
  authId: string | ObjectId;
  username?: string;
  email?: string;
  password?: string;
  avatarColor?: string;
  uId?: string;
  postsCount: number;
  work: string;
  school: string;
  quote: string;
  location: string;
  blocked: mongoose.Types.ObjectId[];
  blockedBy: mongoose.Types.ObjectId[];
  followersCount: number;
  followingCount: number;
  notifications: NotificationSettings;
  social: SocialLinks;
  bgImageVersion: string;
  bgImageId: string;
  profilePicture: string;
  createdAt?: Date;
}

export interface ResetPasswordParams {
  username: string;
  email: string;
  ipaddress: string;
  date: string;
}

export interface NotificationSettings {
  messages: boolean;
  reactions: boolean;
  comments: boolean;
  follows: boolean;
}

export interface BasicInfo {
  quote: string;
  work: string;
  school: string;
  location: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export interface SearchUser {
  _id: string;
  profilePicture: string;
  username: string;
  email: string;
  avatarColor: string;
}

export interface SocketData {
  blockedUser: string;
  blockedBy: string;
}

export interface Login {
  userId: string;
}

export interface UserJobInfo {
  key?: string;
  value?: string | SocialLinks;
}

export interface UserJob {
  keyOne?: string;
  keyTwo?: string;
  key?: string;
  value?: string | NotificationSettings | UserDocument;
}

export interface EmailJob {
  receiverEmail: string;
  template: string;
  subject: string;
}

export interface AllUsers {
  users: UserDocument[];
  totalUsers: number;
}

@Schema({
  collection: 'User',
})
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Auth', index: true })
  authId: string;

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

  @Prop({ type: String, default: '' })
  passwordResetToken: string;

  @Prop({ type: Number })
  passwordResetExpires: number;

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
