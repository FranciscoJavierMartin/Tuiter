import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(8)
  password: string;
}
