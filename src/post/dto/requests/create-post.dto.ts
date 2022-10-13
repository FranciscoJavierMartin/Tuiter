import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post text',
    example: 'Hello there',
    default: '',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  post: string;

  @ApiProperty({
    description: 'Background color',
    nullable: true,
    default: '',
  })
  @IsString()
  @IsOptional()
  bgColor: string;

  @ApiProperty({
    description: 'Post privacy',
    default: '',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  privacy: string;

  @ApiProperty({
    description: 'Post reactions',
    default: '',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  feelings: string;

  @ApiProperty({
    description: 'Gif Url',
    default: '',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  gifUrl?: string;

  @ApiProperty({
    description: 'Author profile picture',
    default: '',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  profilePicture: string;

  @ApiProperty({
    description: 'Image version (Cloudinary)',
    default: '',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  imgVersion: string;

  @ApiProperty({
    description: 'Image Id (Cloudinary)',
    default: '',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  imgId: string;
}
