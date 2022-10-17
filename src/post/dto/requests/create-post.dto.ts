import { Feelings, Privacy } from '@/post/interfaces/post.interface';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post text',
    example: 'Hello there',
    default: '',
    nullable: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  text: string = '';

  @ApiProperty({
    description: 'Background color',
    nullable: true,
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  bgColor: string = '';

  @ApiProperty({
    description: 'Post privacy',
    default: Privacy.Public,
    nullable: true,
    enum: Privacy,
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum(Privacy)
  privacy: Privacy = Privacy.Public;

  @ApiProperty({
    description: 'Post reactions',
    default: Feelings.happy,
    nullable: true,
    enum: Feelings,
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum(Feelings)
  feelings: Feelings;

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

  @ApiProperty({
    description: 'Author profile picture',
    default: '',
    nullable: true,
    required: false,
  })
  @ValidateIf((o) => !!o.profilePicture)
  @IsOptional()
  @IsString()
  @IsUrl()
  profilePicture: string = '';
}
