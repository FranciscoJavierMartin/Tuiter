import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UploadApiResponse } from 'cloudinary';
import { ID } from '@/shared/interfaces/types';
import { UploaderService } from '@/shared/services/uploader.service';
import { UserCacheService } from '@/user/services/user.cache.service';
import { ImageJobData } from '@/image/interfaces/image.interface';
import { ImageRepository } from '@/image/repositories/image.repository';
import { ImageDto } from '@/image/dto/responses/image.dto';
import { UserRepository } from '@/user/repositories/user.repository';
import { User } from '@/user/models/user.model';

@Injectable()
export class ImageService {
  constructor(
    private readonly uploaderService: UploaderService,
    private readonly userCacheService: UserCacheService,
    private readonly imageRepository: ImageRepository,
    private readonly userRepository: UserRepository,
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
      ownerId: userId,
      profilePictureUrl,
      imgId: result.public_id,
      imgVersion: result.version.toString(),
    });
  }

  public async uploadBackgroundImage(
    image: Express.Multer.File,
    ownerId: ID,
  ): Promise<void> {
    const result: UploadApiResponse = await this.uploaderService.uploadImage(
      image,
    );

    if (!result.public_id) {
      throw new BadGatewayException('External server error');
    }

    await Promise.all([
      this.userCacheService.updateUserAttributeInCache(
        ownerId,
        'bgImageId',
        result.public_id,
      ),
      this.userCacheService.updateUserAttributeInCache(
        ownerId,
        'bgImageVersion',
        result.version.toString(),
      ),
    ]);

    // TODO: Emit 'update user'

    this.imageQueue.add('addBackgroundImageToDB', {
      ownerId,
      imgId: result.public_id,
      imgVersion: result.version.toString(),
    });
  }

  public async getImages(ownerId: ID): Promise<ImageDto[]> {
    return await this.imageRepository.getImages(ownerId);
  }

  public async removeImage(imageId: ID): Promise<void> {
    // TODO: Emit 'delete image'

    this.imageQueue.add('removeImage', { imageId });
  }

  public async removeBackgroundImage(userId: ID): Promise<void> {
    const user = await this.userCacheService.getUserFromCache(userId);

    // TODO: Emit 'delete image'

    await Promise.all([
      this.userCacheService.updateUserAttributeInCache(userId, 'bgImageId', ''),
      this.userCacheService.updateUserAttributeInCache(
        userId,
        'bgImageVersion',
        '',
      ),
      this.userRepository.updateUser(userId.toString(), {
        bgImageId: '',
        bgImageVersion: '',
      } as User),
    ]);

    const image = await this.imageRepository.getImageByImgId(user.bgImageId);

    this.imageQueue.add('removeImage', { imageId: image._id });
  }
}
