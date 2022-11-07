import { ID } from '@/shared/interfaces/types';
import { Post } from '@/post/models/post.model';

export enum Privacy {
  Public = 'Public',
  Private = 'Private',
}

export interface GetPostsQuery {
  _id?: ID;
  username?: string;
  imgId?: string;
  gifUrl?: string;
}

export interface DeletePostParams {
  postId: string;
  authorId: ID;
}

export interface UpdatePostParams {
  postId: string;
  post: Post;
}

export interface QueryComplete {
  ok?: number;
  n?: number;
}

export interface QueryDeleted {
  deletedCount?: number;
}
