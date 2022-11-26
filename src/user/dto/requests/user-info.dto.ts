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
    nullable: true,
    required: false,
  })
  @ValidateIf((o) => !!o.quote)
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  quote?: string;
}
