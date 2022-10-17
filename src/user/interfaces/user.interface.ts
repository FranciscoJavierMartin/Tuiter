import { ObjectId } from 'mongodb';
import mongoose, { Document } from 'mongoose';

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
