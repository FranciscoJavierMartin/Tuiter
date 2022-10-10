import { IsEqualTo } from '@/shared/decorators/match.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'User password',
    example: 'test',
    minLength: 4,
    maxLength: 8,
    nullable: false,
  })
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
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  @IsEqualTo<ResetPasswordDto>('password')
  confirmPassword: string;
}
