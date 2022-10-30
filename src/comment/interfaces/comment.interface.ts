import { ID } from '@/shared/interfaces/types';
import { Comment } from '@/comment/models/comment.model';

export type CommentJobData = AddCommentJobData;

export interface AddCommentJobData {
  postId: ID;
  userTo: ID;
  userFrom: ID;
  username: string;
  comment: Comment;
}
