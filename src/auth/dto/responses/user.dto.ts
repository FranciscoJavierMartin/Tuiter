import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { NotificationSettings, SocialLinks } from '@/user/models/user.model';

export class ResponseUserDto {
  @ApiProperty({
    description: 'User id from "Users" collection',
  })
  _id: string | ObjectId;

  @ApiProperty({
    description: 'User id from "Auth" collection',
  })
  authId: string | ObjectId;

  @ApiProperty({
    description: 'User name',
  })
  username?: string;

  @ApiProperty({
    description: 'User email',
  })
  email?: string;

  @ApiProperty({
    description: 'Avatar color',
  })
  avatarColor?: string;

  @ApiProperty({
    description: 'User id',
  })
  uId?: string;

  @ApiProperty({
    description: 'Number of posts created by user',
  })
  postsCount: number;

  @ApiProperty({
    description: 'User job',
  })
  work: string;

  @ApiProperty({
    description: 'User school',
  })
  school: string;

  @ApiProperty({
    description: 'User quote',
  })
  quote: string;

  @ApiProperty({
    description: 'User location',
  })
  location: string;

  @ApiProperty({
    description: 'Users blocked by me',
  })
  blocked: mongoose.Types.ObjectId[];

  @ApiProperty({
    description: 'Users that have blocked me',
  })
  blockedBy: mongoose.Types.ObjectId[];

  @ApiProperty({
    description: 'Users that follow me',
  })
  followersCount: number;

  @ApiProperty({
    description: 'Users that I follow',
  })
  followingCount: number;

  @ApiProperty({
    description: 'User notifications',
  })
  notifications: NotificationSettings;

  @ApiProperty({
    description: 'User social links',
  })
  social: SocialLinks;

  @ApiProperty({
    description: 'Background image version (for cloudinary)',
  })
  bgImageVersion: string;

  @ApiProperty({
    description: 'Background image id (for cloudinary)',
  })
  bgImageId: string;

  @ApiProperty({
    description: 'Profile picture url',
  })
  profilePicture: string;

  @ApiProperty({
    description: 'User created date',
  })
  createdAt?: Date;
}
