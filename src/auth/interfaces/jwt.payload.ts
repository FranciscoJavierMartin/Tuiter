import { ID } from '@/shared/interfaces/types';

export interface JwtPayload {
  userId: ID;
  uId: string;
  email: string;
  username: string;
  avatarColor: string;
  profilePicture: string;
  iat: number;
  exp: number;
}
