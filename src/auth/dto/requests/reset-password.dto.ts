import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { IsEqualTo } from '@/shared/decorators/match.decorator';

@InputType()
export class ResetPasswordDto {
  @ApiProperty({
    description: 'User password',
    example: 'test',
    minLength: 4,
    maxLength: 8,
    nullable: false,
  })
  @Field(() => String, { description: 'User password' })
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  password: string;

  @ApiProperty({
    description: 'Confirm user password',
    example: 'test',
    minLength: 4,
    maxLength: 8,
    nullable: false,
  })
  @Field(() => String, { description: 'Confirm user password' })
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  @IsEqualTo<ResetPasswordDto>('password')
  confirmPassword: string;
}
