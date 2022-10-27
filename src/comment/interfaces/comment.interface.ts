import { ObjectId } from 'mongodb';
import { Comment } from '@/comment/models/comment.model';

export type CommentJobData = AddCommentJobData;

export interface AddCommentJobData {
  postId: ObjectId;
  userTo: ObjectId;
  userFrom: string;
  username: string;
  comment: Comment;
}
