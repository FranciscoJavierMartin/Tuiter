import { ApiProperty } from '@nestjs/swagger';
import { ID } from '@/shared/interfaces/types';
import { Privacy } from '@/post/interfaces/post.interface';
import { Reactions } from '@/reaction/interfaces/reaction.interface';

export class PostDto {
  @ApiProperty({
    description: 'Post id',
    type: String,
    required: true,
  })
  _id: ID;

  @ApiProperty({
    description: 'Author id',
    type: String,
    required: true,
  })
  authorId: ID;

  @ApiProperty({
    description: 'Author name',
    type: String,
    required: true,
  })
  username: string;

  @ApiProperty({
    description: 'Author email',
    type: String,
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'Author avatar color',
    type: String,
    required: true,
  })
  avatarColor: string;

  @ApiProperty({
    description: 'Author profile picture',
    type: String,
    required: false,
  })
  profilePicture: string;

  @ApiProperty({
    description: 'Post text',
    type: String,
    default: '',
    required: false,
  })
  text: string;

  @ApiProperty({
    description: 'Background color',
    type: String,
    default: '',
    required: false,
  })
  bgColor: string;

  @ApiProperty({
    description: 'Image version (Cloudinary)',
    type: String,
    default: '',
    required: false,
  })
  imgVersion: string;

  @ApiProperty({
    description: 'Image Id (Cloudinary)',
    type: String,
    default: '',
    required: false,
  })
  imgId: string;

  @ApiProperty({
    description: 'Feelings',
    type: String,
    default: '',
    required: false,
  })
  feelings: string;

  @ApiProperty({
    description: 'Gif url',
    type: String,
    default: '',
    required: false,
  })
  gifUrl: string;

  @ApiProperty({
    description: 'Post privacy',
    type: String,
    required: true,
  })
  privacy: Privacy;

  @ApiProperty({
    description: 'Number of comments',
    type: Number,
    default: 0,
    required: true,
  })
  commentsCount: number;

  @ApiProperty({
    description: 'Post creation date',
    type: Date,
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Post reactions',
    type: Object,
    required: true,
  })
  reactions: Reactions;
}
