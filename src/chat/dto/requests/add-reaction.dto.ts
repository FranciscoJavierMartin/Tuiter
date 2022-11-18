import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { ID } from '@/shared/interfaces/types';
import { Feelings } from '@/reaction/interfaces/reaction.interface';

export class AddReactionDto {
  @ApiProperty({
    description: 'Message id',
    nullable: false,
    example: '6352eb20e5f1c6d76008deec',
    required: true,
  })
  @IsMongoId()
  messageId: ID;

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
}
