import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

@Injectable()
export class UploaderService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Upload image to Cloudinary
   * @param file File to be uploaded
   * @param public_id public id to upload the image
   * @param overwrite overwrite the image
   * @param invalidate invalidate previous image
   * @returns Result of upload operation
   */
  public async uploadImage(
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

  /**
   * Get image url
   * @param version
   * @param publicId
   * @returns image url
   */
  public getImageUrl(version: number, publicId: string): string {
    return `https://res.cloudinary.com/${this.configService.get(
      'CLOUDINARY_CLOUD_NAME',
    )}/image/upload/v${version}/${publicId}`;
  }

  /**
   * Remove image from Cloudinary
   * @param imgId Image id (Public id)
   * @returns Result from remove image
   */
  public async removeImage(imgId: string): Promise<void> {
    await cloudinary.uploader.destroy(imgId, {});
  }
}
