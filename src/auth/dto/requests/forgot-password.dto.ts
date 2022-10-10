import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsEmail()
  email: string;
}
