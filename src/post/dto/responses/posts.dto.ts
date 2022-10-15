import { Post } from '@/post/models/post.schema';

export class PostsDto {
  postsCount: number;
  posts: Post[];
}
