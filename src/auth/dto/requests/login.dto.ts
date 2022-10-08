import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User name',
    example: 'johndoe',
    minLength: 4,
    maxLength: 8,
    nullable: false,
    uniqueItems: true,
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
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  password: string;
}
