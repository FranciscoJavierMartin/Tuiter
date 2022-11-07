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
    userId: ObjectId,
    url: string,
    imgId: string,
    imgVersion: string,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $set: { profilePicture: url },
    });
    await this.addImage(userId, imgId, imgVersion);
  }

  public async addImage(
    userId: ObjectId,
    imgId: string,
    imgVersion: string,
  ): Promise<void> {
    await this.imageModel.create({
      userId,
      imgId,
      imgVersion,
    });
  }
}
