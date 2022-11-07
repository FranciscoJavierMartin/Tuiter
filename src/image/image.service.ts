import { BadGatewayException, Injectable } from '@nestjs/common';
import { UploaderService } from '@/shared/services/uploader.service';
import { ID } from '@/shared/interfaces/types';
import { UploadApiResponse } from 'cloudinary';
import { UserCacheService } from '@/user/services/user.cache.service';
import { Queue } from 'bull';
import { ImageJobData } from '@/image/interfaces/image.interface';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ImageService {
  constructor(
    private readonly uploaderService: UploaderService,
    private readonly userCacheService: UserCacheService,
    @InjectQueue('image') private readonly imageQueue: Queue<ImageJobData>,
  ) {}

  public async uploadProfilePicture(
    image: Express.Multer.File,
    userId: ID,
  ): Promise<void> {
    const result: UploadApiResponse = await this.uploaderService.uploadImage(
      image,
      userId.toString(),
      true,
      true,
    );

    if (!result.public_id) {
      throw new BadGatewayException('External server error');
    }

    const profilePictureUrl = this.uploaderService.getImageUrl(
      result.version,
      result.public_id,
    );

    await this.userCacheService.updateUserAttributeInCache(
      userId,
      'profilePicture',
      profilePictureUrl,
    );

    // TODO: Emit 'update user'

    this.imageQueue.add('addUserProfilePictureToDB', {
      userId,
      profilePictureUrl,
      imgId: result.public_id,
      imgVersion: result.version.toString(),
    });
  }
}
