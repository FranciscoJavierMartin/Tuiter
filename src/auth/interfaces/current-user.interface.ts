import { ID } from '@/shared/interfaces/types';

export interface CurrentUser {
  userId: ID;
  uId: string;
  email: string;
  username: string;
  avatarColor: string;
  profilePicture: string;
}
