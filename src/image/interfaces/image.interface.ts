import { ID } from '@/shared/interfaces/types';

export type ImageJobData =
  | AddUserProfilePictureJobData
  | AddImageJobData
  | RemoveImageJobData
  | UpdateImageJobData;

export interface AddUserProfilePictureJobData {
  ownerId: ID;
  profilePictureUrl: string;
  imgId: string;
  imgVersion: string;
}

export interface AddImageJobData {
  ownerId: ID;
  imgId: string;
  imgVersion: string;
  isVideo?: boolean;
}

export interface UpdateImageJobData {
  imgId: string;
  imgVersion: string;
}

export interface RemoveImageJobData {
  imageId: ID;
}
