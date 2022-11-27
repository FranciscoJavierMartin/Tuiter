import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, ValidateIf } from 'class-validator';

export class SocialLinksDto {
  // TODO: Replace for ApiPropertyOptional
  @ApiProperty({
    description: 'Facebook profile link',
    required: false,
  })
  @ValidateIf((o) => !!o.facebook)
  @IsString()
  @IsUrl()
  @IsOptional()
  facebook?: string;

  @ApiProperty({
    description: 'Instagram profile link',
    required: false,
  })
  @ValidateIf((o) => !!o.instagram)
  @IsString()
  @IsUrl()
  @IsOptional()
  instagram?: string;

  @ApiProperty({
    description: 'Twitter profile link',
    required: false,
  })
  @ValidateIf((o) => !!o.twitter)
  @IsString()
  @IsUrl()
  @IsOptional()
  twitter?: string;

  @ApiProperty({
    description: 'Youtube profile link',
    required: false,
  })
  @ValidateIf((o) => !!o.youtube)
  @IsString()
  @IsUrl()
  @IsOptional()
  youtube?: string;
}
