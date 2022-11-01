import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ID } from '@/shared/interfaces/types';
import { Feelings } from '@/reaction/interfaces/reaction.interface';

export class AddReactionDto {
  @ApiProperty({
    description: 'Reaction receiver',
    nullable: false,
    example: '6352eb20e5f1c6d76008deec',
    required: true,
  })
  @IsMongoId()
  userTo: ID;

  @ApiProperty({
    description: 'Post id where reaction belong',
    example: '6352eb20e5f1c6d76008deec',
    required: true,
  })
  @IsMongoId()
  postId: ID;

  @ApiProperty({
    description: 'Post reaction',
    example: Feelings.happy,
    nullable: false,
    enum: Feelings,
    required: true,
  })
  @IsString()
  @IsEnum(Feelings)
  feeling: Feelings;

  @ApiProperty({
    description: 'Previous reaction',
    default: Feelings.happy,
    nullable: true,
    enum: Feelings,
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum(Feelings)
  previousFeeling?: Feelings;
}
