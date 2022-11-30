import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { User } from '@/user/models/user.model';
import { Image } from '@/image/models/image.model';

@Injectable()
export class ImageRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Image.name)
    private readonly imageModel: Model<Image>,
  ) {}

  /**
   * Add profile picture to user
   * @param ownerId User id
   * @param url picture url
   * @param imgId Image id (Cloudinary)
   * @param imgVersion Image version (Cloudinary)
   */
  public async addUserProfilePictureToDB(
    ownerId: ObjectId,
    url: string,
    imgId: string,
    imgVersion: string,
  ): Promise<void> {
    // TODO: Remove folder from imgId
    await Promise.all([
      await this.userModel.findByIdAndUpdate(ownerId, {
        $set: { profilePicture: url },
      }),
      await this.addImage(ownerId, imgId, imgVersion),
    ]);
  }

  /**
   * Add background image to user
   * @param ownerId User id
   * @param imgId Image id (Cloudinary)
   * @param imgVersion Image version (Cloudinary)
   */
  public async addBackgroundImageToDB(
    ownerId: ObjectId,
    imgId: string,
    imgVersion: string,
  ): Promise<void> {
    // TODO: Remove folder from imgId
    await Promise.all([
      await this.userModel.findByIdAndUpdate(ownerId, {
        $set: { bgImageId: imgId, bgImageVersion: imgVersion },
      }),
      await this.addImage(ownerId, imgId, imgVersion),
    ]);
  }

  /**
   * Add image to db
   * @param ownerId User id
   * @param imgId Image id (Cloudinary)
   * @param imgVersion Image version (Cloudinary)
   */
  public async addImage(
    ownerId: ObjectId,
    imgId: string,
    imgVersion: string,
    isVideo?: boolean,
  ): Promise<void> {
    await this.imageModel.findOneAndUpdate(
      {
        ownerId,
        imgId,
        imgVersion,
      },
      {
        $set: {
          ownerId,
          imgId,
          imgVersion,
          isVideo,
        },
      },
      { upsert: true },
    );
  }

  /**
   * Update image
   * @param imgId Image id (Cloudinary)
   * @param imgVersion Image version (Cloudinary)
   */
  public async updateImage(imgId: string, imgVersion: string): Promise<void> {
    await this.imageModel.findOneAndUpdate({ imgId }, { $set: { imgVersion } });
  }

  /**
   * Get all images by owner
   * @param ownerId User id
   */
  public async getImages(ownerId: ObjectId): Promise<Image[]> {
    return await this.imageModel.find({
      ownerId,
    });
  }

  /**
   * Get image by id
   * @param imageId Image id
   */
  public async getImageById(imageId: ObjectId): Promise<Image> {
    return await this.imageModel.findById(imageId);
  }

  /**
   * Get image by imgId
   * @param imgId Image id (Cloudinary)
   */
  public async getImageByImgId(imgId: string): Promise<Image> {
    return await this.imageModel.findOne({ imgId });
  }

  /**
   * Remove image by id
   * @param imageId Image id
   */
  public async removeImageFromDB(imageId: ObjectId): Promise<Image> {
    return await this.imageModel.findByIdAndDelete(imageId);
  }
}
