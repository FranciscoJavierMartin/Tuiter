import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

@Injectable()
export class UploaderService {
  constructor(private configService: ConfigService) {}

  async uploadImage(
    file: Express.Multer.File,
    public_id?: string,
    overwrite?: boolean,
    invalidate?: boolean,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
          public_id,
          overwrite,
          invalidate,
          folder: this.configService.get('CLOUDINARY_FOLDER'),
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  getImageUrl(version: number, publicId: string): string {
    return `https://res.cloudinary.com/${this.configService.get(
      'CLOUDINARY_CLOUD_NAME',
    )}/image/upload/v${version}/${publicId}`;
  }
}
