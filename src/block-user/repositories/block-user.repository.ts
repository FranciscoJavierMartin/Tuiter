import { User } from '@/user/models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlockUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async isUserBlockedBy(userId: ObjectId, followeeId: ObjectId) {
    //TODO: Check when there are users blocked
    return await this.userModel.findOne({
      _id: userId,
      blockedBy: followeeId,
    });
  }
}
