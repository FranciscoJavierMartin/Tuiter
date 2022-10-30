import { Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ID } from '@/shared/interfaces/types';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { FollowerService } from '@/follower/services/follower.service';
import { NotMySelfGuard } from '@/follower/guards/not-my-self.guard';

@ApiTags('Follow')
@Controller('user')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Put('follow/:followeeId')
  @UseGuards(AuthGuard(), NotMySelfGuard)
  public async follow(
    @Param('followeeId', ValidateIdPipe) followeeId: ID,
    @GetUser() user: CurrentUser,
  ): Promise<void> {
    return this.followerService.follow(followeeId, user.userId, user.username);
  }

  @Put('unfollow/:followeeId')
  @UseGuards(AuthGuard(), NotMySelfGuard)
  public async unfollow(
    @Param('followeeId', ValidateIdPipe) followeeId: ID,
    @GetUser() user: CurrentUser,
  ) {
    return this.followerService.unfollow(followeeId, user.userId);
  }
}
