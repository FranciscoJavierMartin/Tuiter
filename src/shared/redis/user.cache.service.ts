import { Injectable } from '@nestjs/common';

@Injectable()
export class UserCacheService {
  saveUserToCache(
    arg0: string,
    uId: string,
    userDataToCache: any,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
