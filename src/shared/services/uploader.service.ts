import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

@Injectable()
export class UploaderService {
  async uploadImage(
    file: Express.Multer.File,
    public_id?: string,
    overwrite?: boolean,
    invalidate?: boolean,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        `data:image/jpeg;base64,${file.buffer.toString('base64')}`,
        {
          public_id,
          overwrite,
          invalidate,
          folder: 'chatty-nest',
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            console.log('Error');
            reject(error);
          } else {
            console.log('Resolve');
            resolve(result);
          }
        },
      );
    });
  }
}
