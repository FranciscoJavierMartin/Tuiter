import { Injectable } from '@nestjs/common';
import { UploaderService } from '@/shared/services/uploader.service';
import { ID } from '@/shared/interfaces/types';

@Injectable()
export class ImageService {
  constructor(private readonly uploaderService: UploaderService) {}

  public async uploadProfilePicture(
    image: Express.Multer.File,
    userId: ID,
  ): Promise<void> {
    // this.uploaderService.uploadImage(image, )
  }
}
