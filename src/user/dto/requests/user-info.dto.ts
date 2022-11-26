import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UserInfoDto {
  @ApiProperty({
    description: 'Quote to be displayed in user profile page',
    required: false,
  })
  @ValidateIf((o) => !!o.quote)
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  quote?: string;

  @ApiProperty({
    description: 'User work',
    required: false,
  })
  @ValidateIf((o) => !!o.work)
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(30)
  work?: string;

  @ApiProperty({
    description: 'User work',
    required: false,
  })
  @ValidateIf((o) => !!o.school)
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  school?: string;

  @ApiProperty({
    description: 'User location',
    required: false,
  })
  @ValidateIf((o) => !!o.location)
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  location?: string;
}
