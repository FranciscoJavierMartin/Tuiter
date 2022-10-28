import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { ID } from '@/shared/interfaces/types';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment receiver',
    nullable: false,
    example: '6352eb20e5f1c6d76008deec',
    required: true,
  })
  @IsMongoId()
  userTo: ID;

  @ApiProperty({
    description: 'Post id where comment belong',
    example: '6352eb20e5f1c6d76008deec',
    required: true,
  })
  @IsMongoId()
  postId: ID;

  @ApiProperty({
    description: 'Comment text',
    example: 'Hello there',
    nullable: false,
    required: true,
  })
  @IsString()
  text: string;
}
