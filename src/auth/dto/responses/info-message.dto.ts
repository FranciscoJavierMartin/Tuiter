import { ApiProperty } from '@nestjs/swagger';

export class InfoMessageDto {
  @ApiProperty({
    description: 'Message with info',
  })
  message: string;
}
