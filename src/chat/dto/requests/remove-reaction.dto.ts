import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { ID } from '@/shared/interfaces/types';

export class RemoveReactionDto {
  @ApiProperty({
    description: 'Message id',
    nullable: false,
    example: '6352eb20e5f1c6d76008deec',
    required: true,
  })
  @IsMongoId()
  messageId: ID;

  @ApiProperty({
    description: 'Chat id',
    nullable: false,
    example: '6352eb20e5f1c6d76008deec',
    required: true,
  })
  @IsMongoId()
  chatId: ID;
}
