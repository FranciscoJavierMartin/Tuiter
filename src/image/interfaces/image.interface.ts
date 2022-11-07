import { ID } from '@/shared/interfaces/types';

export type ImageJobData = UpdateImageJobData;

export interface UpdateImageJobData {
  userId: ID;
  profilePictureUrl: string;
  imgId: string;
  imgVersion: string;
}
