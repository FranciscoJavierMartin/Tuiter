import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class InfoMessageDto {
  @ApiProperty({
    description: 'Message with info',
  })
  @Field(() => String, { description: 'Message with info' })
  message: string;
}
