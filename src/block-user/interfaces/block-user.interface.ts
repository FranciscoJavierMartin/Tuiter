import { ID } from '@/shared/interfaces/types';

export type BlockUserJobData = AddBlockUserJobData;

export interface AddBlockUserJobData {
  userId: ID;
  followerId: ID;
}
