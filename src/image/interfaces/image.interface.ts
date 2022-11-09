import { ID } from '@/shared/interfaces/types';

export type ImageJobData =
  | AddUserProfilePictureJobData
  | AddImageJobData
  | RemoveImageJobData
  | UpdateImageJobData;

export interface AddUserProfilePictureJobData {
  userId: ID;
  profilePictureUrl: string;
  imgId: string;
  imgVersion: string;
}

export interface AddImageJobData {
  userId: ID;
  imgId: string;
  imgVersion: string;
}

export interface UpdateImageJobData {
  imgId: string;
  imgVersion: string;
}

export interface RemoveImageJobData {
  imageId: ID;
}
