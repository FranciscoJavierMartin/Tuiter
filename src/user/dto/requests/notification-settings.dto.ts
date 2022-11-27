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
}
