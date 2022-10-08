import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { NotificationSettings, SocialLinks } from '@/user/models/user.model';

export class ResponseUserDto {
  @ApiProperty({
    description: 'User id from "Users" collection',
  })
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
