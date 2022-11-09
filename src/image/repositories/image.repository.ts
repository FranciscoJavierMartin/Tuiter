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

  public async addImage(
    ownerId: ObjectId,
    imgId: string,
    imgVersion: string,
  ): Promise<void> {
    await this.imageModel.create({
      ownerId,
      imgId,
      imgVersion,
    });
  }

  public async updateImage(imgId: string, imgVersion: string): Promise<void> {
    await this.imageModel.findOneAndUpdate({ imgId }, { $set: { imgVersion } });
  }

  public async getImages(ownerId: ObjectId): Promise<Image[]> {
    return await this.imageModel.find({
      ownerId,
    });
  }

  public async getImageById(imageId: ObjectId): Promise<Image> {
    return await this.imageModel.findById(imageId);
  }

  public async getImageByImgId(imgId: string): Promise<Image> {
    return await this.imageModel.findOne({ imgId });
  }

  public async removeImageFromDB(imageId: ObjectId): Promise<Image> {
    return await this.imageModel.findByIdAndDelete(imageId);
  }
}
