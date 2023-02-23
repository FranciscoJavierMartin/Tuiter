import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

@ArgsType()
export class ForgotPasswordDto {
  @ApiProperty({
    description: 'User email',
    required: true,
    uniqueItems: true,
  })
  @Field(() => String, { description: 'User email' })
  @IsString()
  @IsEmail()
  email: string;
}
