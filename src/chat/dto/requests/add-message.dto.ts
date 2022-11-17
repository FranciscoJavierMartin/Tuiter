import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, ValidateIf } from 'class-validator';

export class AddMessageDto {
  @ApiProperty({
    description: 'Text message',
    example: 'Hello world',
    required: false,
    default: '',
  })
  @IsString()
  @IsOptional()
  text: string = '';

  @ApiProperty({
    description: 'Gif Url',
    default: '',
    nullable: true,
    required: false,
  })
  @ValidateIf((o) => !!o.gifUrl)
  @IsString()
  @IsUrl()
  @IsOptional()
  gifUrl: string = '';
}
