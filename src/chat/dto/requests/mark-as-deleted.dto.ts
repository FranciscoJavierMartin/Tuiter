import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId } from 'class-validator';
import { ID } from '@/shared/interfaces/types';

export class MarkMessageAsDeletedDto {
  @ApiProperty({
    description: 'Sender id',
    nullable: false,
    example: '6352eb20e5f1c6d76008deec',
    required: true,
  })
  @IsMongoId()
  senderId: ID;

  @ApiProperty({
    description: 'Receiver id',
    nullable: false,
    example: '6352eb20e5f1c6d76008deec',
    required: true,
  })
  @IsMongoId()
  receiverId: ID;

  @ApiProperty({
    description: 'Message id',
    nullable: false,
    example: '6352eb20e5f1c6d76008deec',
    required: true,
  })
  @IsMongoId()
  messageId: ID;

  @ApiProperty({
    description: 'Remove message just for me or for both',
  })
  @IsBoolean()
  justForMe: boolean;
}
