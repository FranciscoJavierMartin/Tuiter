import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { ID } from '@/shared/interfaces/types';

export class MarkAsReadDto {
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
}
