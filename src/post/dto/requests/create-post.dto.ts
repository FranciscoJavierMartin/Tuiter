import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export enum Privacy {
  Public = 'Public',
  Private = 'Private',
}

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
    default: Privacy.Public,
    nullable: true,
    enum: Privacy,
  })
  @IsString()
  @IsOptional()
  @IsEnum(Privacy)
  privacy: Privacy;

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
  @ValidateIf((o) => !!o.gifUrl)
  @IsString()
  @IsUrl()
  @IsOptional()
  gifUrl?: string;

  @ApiProperty({
    description: 'Author profile picture',
    default: '',
    nullable: true,
  })
  @ValidateIf((o) => !!o.profilePicture)
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
