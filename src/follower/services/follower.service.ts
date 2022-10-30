import { Injectable } from '@nestjs/common';
import { ID } from '@/shared/interfaces/types';

@Injectable()
export class FollowerService {
  follow(followeeId: ID, userId: ID, username: string) {
    throw new Error('Method not implemented.');
  }
}
