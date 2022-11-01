import { ID } from '@/shared/interfaces/types';
import { ApiProperty } from '@nestjs/swagger';

// TODO: Needs to add properties
export class CommentDto {
  @ApiProperty({
    description: 'Comment id',
    type: String,
    required: true,
  })
  _id: ID;

  @ApiProperty({
    description: 'Post id where comment belong',
    type: String,
    required: true,
  })
  postId: ID;

  @ApiProperty({
    description: 'Text comment',
    type: String,
    required: false,
  })
  text: string;

  @ApiProperty({
    description: 'Author name',
    type: String,
    required: true,
  })
  username: string;

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
    description: 'Comment creation date',
    type: Date,
    required: false,
  })
  createdAt: Date;
}
