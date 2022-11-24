import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'New password',
    example: 'Johndoe1',
    minLength: 4,
    maxLength: 8,
    nullable: false,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  newPassword: string;
}
