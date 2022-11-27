import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class NotificationSettingsDto {
  @ApiPropertyOptional({
    name: 'messages',
    description: 'Enable or disable email notifications for messages',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  messages?: boolean;

  @ApiPropertyOptional({
    name: 'reactions',
    description: 'Enable or disable email notifications for reactions',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  reactions?: boolean;

  @ApiPropertyOptional({
    name: 'comments',
    description: 'Enable or disable email notifications for comments',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  comments?: boolean;

  @ApiPropertyOptional({
    name: 'follows',
    description: 'Enable or disable email notifications for follows',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  follows?: boolean;
}
