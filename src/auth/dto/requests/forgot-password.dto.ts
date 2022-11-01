import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'User email',
    required: true,
    uniqueItems: true,
  })
  @IsString()
  @IsEmail()
  email: string;
}
