import { ObjectId } from 'mongodb';
import { Post } from '@/post/models/post.schema';

export enum Privacy {
  Public = 'Public',
  Private = 'Private',
}

export interface GetPostsQuery {
  _id?: ObjectId | string;
  username?: string;
  imgId?: string;
  gifUrl?: string;
}

export interface DeletePostParams {
  postId: string;
  authorId: string;
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
