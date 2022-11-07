import { Controller, Patch } from '@nestjs/common';
import { ImageService } from '@/image/image.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Patch('profile')
  public async uploadProfilePicture() {}
}
