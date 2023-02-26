import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class ChangePasswordDto {
  @ApiProperty({
    description: 'New password',
    example: 'Johndoe1',
    minLength: 4,
    maxLength: 8,
    nullable: false,
  })
  @Field(() => String, { description: 'New password' })
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  newPassword: string;
}
