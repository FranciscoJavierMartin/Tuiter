import { Controller } from '@nestjs/common';
import { ImageService } from '@/image/image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
}
