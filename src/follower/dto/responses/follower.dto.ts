import { ApiProperty } from '@nestjs/swagger';
import { ID } from '@/shared/interfaces/types';
import { UserDocument } from '@/user/models/user.model';

export class FollowerDto {
  @ApiProperty({
    description: 'User id from "Users" collection',
    type: String,
    required: true,
  })
  _id: ID;

  @ApiProperty({
    description: 'Avatar color',
    type: String,
    required: true,
  })
  avatarColor: string;

  @ApiProperty({
    description: 'Followers count',
    type: Number,
    required: true,
  })
  followersCount: number;

  @ApiProperty({
    description: 'Following users count',
    type: Number,
    required: true,
  })
  followingCount: number;

  @ApiProperty({
    description: 'User profile picture',
    type: String,
    required: false,
  })
  profilePicture: string;

  @ApiProperty({
    description: 'User posted count',
    type: Number,
    required: true,
  })
  postsCount: number;

  @ApiProperty({
    description: 'User name',
    type: String,
    required: true,
  })
  username: string;

  @ApiProperty({
    description: 'User id',
    type: String,
    required: true,
  })
  uId: string;

  @ApiProperty({
    description: 'User data',
    type: Object,
    required: false,
  })
  userProfile?: UserDocument;
}
