import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(8)
  password: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  avatarColor: string;
}
