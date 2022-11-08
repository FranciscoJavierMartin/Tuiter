import { ID } from '@/shared/interfaces/types';

export type ImageJobData =
  | AddUserProfilePictureJobData
  | AddBackgroundImageJobData
  | RemoveImageJobData;

export interface AddUserProfilePictureJobData {
  userId: ID;
  profilePictureUrl: string;
  imgId: string;
  imgVersion: string;
}

export interface AddBackgroundImageJobData {
  userId: ID;
  imgId: string;
  imgVersion: string;
}

export interface RemoveImageJobData {
  imageId: ID;
}
