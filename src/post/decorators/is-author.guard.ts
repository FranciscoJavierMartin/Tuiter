import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PostRepository } from '@/post/repositories/post.repository';

@Injectable()
export class IsAuthorGuard implements CanActivate {
  constructor(private readonly postRespository: PostRepository) {}

  /**
   * Check if current user is post's author
   * @param context Execution context
   * @returns True if current user is post's author, false otherwise
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const postId = request.params.postId;

    const authorId = await this.postRespository.getPostAuthorId(postId);
    const userId = request.user.userId;

    return authorId === userId;
  }
}
