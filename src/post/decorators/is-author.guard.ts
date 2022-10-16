import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PostService } from '@/post/services/post.service';

@Injectable()
export class IsAuthorGuard implements CanActivate {
  constructor(private readonly postService: PostService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const postId = request.params.postId;

    const authorId = await this.postService.getPostAuthorId(postId);
    const userId = request.user.userId;

    return authorId === userId;
  }
}
