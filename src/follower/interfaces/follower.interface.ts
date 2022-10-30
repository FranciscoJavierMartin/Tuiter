import { ID } from '@/shared/interfaces/types';
import { UserDocument } from '@/user/models/user.model';

export type FollowJobData = AddFollowJobData;

export interface AddFollowJobData {
  userId: ID;
  followeeId: ID;
}

export interface FollowerData {
  avatarColor: string;
  followersCount: number;
  followingCount: number;
  profilePicture: string;
  postCount: number;
  username: string;
  uId: string;
  _id?: ID;
  userProfile?: UserDocument;
}
