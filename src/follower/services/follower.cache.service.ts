import { Injectable } from '@nestjs/common';
import { ObjectId } from 'bson';

@Injectable()
export class FollowerCacheService {
  public async isUserBlockedBy(
    followeeId: ObjectId,
    userId: ObjectId,
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
