import { ArgsType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

@ArgsType()
export class LoginDto {
  @ApiProperty({
    description: 'User name',
    example: 'johndoe',
    minLength: 4,
    maxLength: 8,
    nullable: false,
    uniqueItems: true,
  })
  @Field(() => String, {
    description:
      'User name. It is unique. Minimum length 4 and maximun lenght 8.',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'test',
    minLength: 4,
    maxLength: 8,
    nullable: false,
    uniqueItems: true,
  })
  @Field(() => String, {
    description: 'User password. Minimum length 4 and maximun lenght 8.',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  password: string;
}
