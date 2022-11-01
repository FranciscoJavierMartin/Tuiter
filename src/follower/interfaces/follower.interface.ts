import { ID } from '@/shared/interfaces/types';

export type FollowJobData = AddFollowJobData;

export interface AddFollowJobData {
  userId: ID;
  followeeId: ID;
}
