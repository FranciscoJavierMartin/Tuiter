import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ID } from '@/shared/interfaces/types';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { FollowerService } from '@/follower/services/follower.service';
import { NotMySelfGuard } from '@/follower/guards/not-my-self.guard';
import { FollowerDto } from '@/follower/dto/responses/follower.dto';

@ApiTags('Follow')
@Controller('user')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Put('follow/:followeeId')
  @ApiOkResponse({
    description: 'User follows followee user',
  })
  @ApiBadRequestResponse({
    description: 'User is blocked by followee user',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard(), NotMySelfGuard)
  public async follow(
    @Param('followeeId', ValidateIdPipe) followeeId: ID,
    @GetUser() user: CurrentUser,
  ): Promise<void> {
    return this.followerService.follow(followeeId, user.userId, user.username);
  }

  @Put('unfollow/:followeeId')
  @ApiOkResponse({
    description: 'User unfollow',
  })
  @ApiBadRequestResponse({
    description: 'User is not following followee user',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard(), NotMySelfGuard)
  public async unfollow(
    @Param('followeeId', ValidateIdPipe) followeeId: ID,
    @GetUser() user: CurrentUser,
  ): Promise<void> {
    return this.followerService.unfollow(followeeId, user.userId);
  }

  @Get('following/:userId')
  @ApiOkResponse({
    description: 'Users who passed user follows',
    type: [FollowerDto],
  })
  public async getFollowingUsers(
    @Param('userId', ValidateIdPipe) userId: ID,
  ): Promise<FollowerDto[]> {
    return this.followerService.getFollowingUsers(userId);
  }

  @Get('followers/:userId')
  @ApiOkResponse({
    description: 'Users who follow passed user',
    type: [FollowerDto],
  })
  public async getFollowers(
    @Param('userId', ValidateIdPipe) userId: ID,
  ): Promise<FollowerDto[]> {
    return this.followerService.getFollowers(userId);
  }
}
