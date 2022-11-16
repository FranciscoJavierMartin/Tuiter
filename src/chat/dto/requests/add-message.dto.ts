import { ID } from '@/shared/interfaces/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class AddMessageDto {
  @ApiProperty({
    description: 'Message receiver id',
    nullable: false,
    example: '6352eb20e5f1c6d76008deec',
    required: true,
  })
  @IsMongoId()
  receiverId: ID;

  @ApiProperty({
    description: 'Chat id (optional)',
    example: '6352eb20e5f1c6d76008deec',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  chatId: ID;
}
