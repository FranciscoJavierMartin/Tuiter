import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UploadApiResponse } from 'cloudinary';
import { ID } from '@/shared/interfaces/types';
import { UploaderService } from '@/shared/services/uploader.service';
import { UserCacheService } from '@/user/services/user.cache.service';
import { ImageJobData } from '@/image/interfaces/image.interface';

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

  public async uploadBackgroundImage(
    image: Express.Multer.File,
    userId: ID,
  ): Promise<void> {
    const result: UploadApiResponse = await this.uploaderService.uploadImage(
      image,
    );

    if (!result.public_id) {
      throw new BadGatewayException('External server error');
    }

    await Promise.all([
      this.userCacheService.updateUserAttributeInCache(
        userId,
        'bgImageId',
        result.public_id,
      ),
      this.userCacheService.updateUserAttributeInCache(
        userId,
        'bgImageVersion',
        result.version.toString(),
      ),
    ]);

    // TODO: Emit 'update user'

    this.imageQueue.add('addBackgroundImageToDB', {
      userId,
      imgId: result.public_id,
      imgVersion: result.version.toString(),
    });
  }
}
