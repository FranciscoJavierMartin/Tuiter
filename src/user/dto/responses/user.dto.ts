import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  NotificationSettings,
  SocialLinks,
} from '@/user/interfaces/user.interface';
import { UserDocument } from '@/user/models/user.model';

@ObjectType()
export class UserDto {
  @ApiProperty({
    description: 'User id from "Users" collection',
    type: String,
  })
  @Field(() => ID)
  _id: string;

  @ApiProperty({
    description: 'User name',
  })
  @Field(() => String, { nullable: true })
  username?: string;

  @ApiProperty({
    description: 'User email',
  })
  @Field(() => String, { nullable: true })
  email?: string;

  @ApiProperty({
    description: 'Avatar color',
  })
  @Field(() => String, { nullable: true })
  avatarColor?: string;

  @ApiProperty({
    description: 'User id',
  })
  @Field(() => String, { nullable: true })
  uId?: string;

  @ApiProperty({
    description: 'Number of posts created by user',
  })
  @Field(() => Int)
  postsCount: number;

  @ApiProperty({
    description: 'User job',
  })
  @Field(() => String)
  work: string;

  @ApiProperty({
    description: 'User school',
  })
  @Field(() => String)
  school: string;

  @ApiProperty({
    description: 'User quote',
  })
  @Field(() => String)
  quote: string;

  @ApiProperty({
    description: 'User location',
  })
  @Field(() => String)
  location: string;

  @ApiProperty({
    description: 'Users blocked by me',
  })
  @Field(() => [ID])
  blocked: string[];

  @ApiProperty({
    description: 'Users that have blocked me',
  })
  @Field(() => [ID])
  blockedBy: string[];

  @ApiProperty({
    description: 'Users that follow me',
  })
  @Field(() => Int)
  followersCount: number;

  @ApiProperty({
    description: 'Users that I follow',
  })
  @Field(() => Int)
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
    this.notifications = user.notifications as unknown as NotificationSettings;
    this.social = user.social as unknown as SocialLinks;
    this.bgImageId = user.bgImageId;
    this.bgImageVersion = user.bgImageVersion;
    this.profilePicture = user.profilePicture;
    this.createdAt = user.createdAt;
  }
}
