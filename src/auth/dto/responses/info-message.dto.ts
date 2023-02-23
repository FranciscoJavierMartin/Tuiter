import { Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

export class InfoMessageDto {
  @ApiProperty({
    description: 'Message with info',
  })
  @Field(() => String)
  message: string;
}
