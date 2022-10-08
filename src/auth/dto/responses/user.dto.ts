import { ApiProperty } from '@nestjs/swagger';
import {
  NotificationSettings,
  SocialLinks,
  UserDocument,
} from '@/user/models/user.model';

export class UserDto {
  @ApiProperty({
    description: 'User id from "Users" collection',
    type: String,
  })
  _id: string;

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
  blocked: string[];

  @ApiProperty({
    description: 'Users that have blocked me',
  })
  blockedBy: string[];

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

  constructor(user: UserDocument) {
    this._id = user._id.toString();
    this.uId = user.uId;
    this.username = user.username;
    this.email = user.email;
    this.avatarColor = user.avatarColor;
    this.postsCount = user.postsCount;
    this.work = user.work;
    this.school = user.school;
    this.quote = user.quote;
    this.location = user.location;
    this.blocked = user.blocked.map((id) => id.toString());
    this.blockedBy = user.blockedBy.map((id) => id.toString());
    this.followersCount = user.followersCount;
    this.followingCount = user.followingCount;
    this.notifications = user.notifications;
    this.social = user.social;
    this.bgImageId = user.bgImageId;
    this.bgImageVersion = user.bgImageVersion;
    this.profilePicture = user.profilePicture;
    this.createdAt = user.createdAt;
  }
}
