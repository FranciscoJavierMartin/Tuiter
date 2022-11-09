import { ApiProperty } from '@nestjs/swagger';
import { ID } from '@/shared/interfaces/types';

export class ImageDto {
  @ApiProperty({
    description: 'Image id',
    type: String,
    required: true,
  })
  _id: ID;

  @ApiProperty({
    description: 'Owner id',
    type: String,
    required: true,
  })
  ownerId: ID;

  @ApiProperty({
    description: 'image id (Cloudinary)',
    type: String,
    required: true,
  })
  imgId: string;

  @ApiProperty({
    description: 'image version (Cloudinary)',
    type: String,
    required: true,
  })
  imgVersion: string;

  @ApiProperty({
    description: 'Creation date',
    type: Date,
    required: true,
  })
  createdAt: Date;
}
