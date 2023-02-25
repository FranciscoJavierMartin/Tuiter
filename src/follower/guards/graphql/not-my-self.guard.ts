import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { checkUserIsNotFollowerOrFollowee } from '@/helpers/request-utils';

@Injectable()
export class NotMySelfGuard implements CanActivate {
  /**
   * Check if current user is the follower or the followee user
   * @param context
   * @returns True if current user is not the follower or the followee user, false otherwise
   */
  public canActivate(context: ExecutionContext): boolean {
    const ctx: GqlExecutionContext = GqlExecutionContext.create(context);
    const userId = ctx.getContext().req?.user?.userId;
    const { followeeId, followerId } = ctx.getArgs<{
      followerId?: string;
      followeeId: string;
    }>();

    return checkUserIsNotFollowerOrFollowee(userId, followerId, followeeId);
  }
}
