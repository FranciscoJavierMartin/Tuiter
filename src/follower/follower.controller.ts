import { Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ID } from '@/shared/interfaces/types';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { FollowerService } from '@/follower/follower.service';
import { NotMySelfGuard } from './guards/not-my-self.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/auth/decorators/get-user.decorator';

@ApiTags('Follow')
@Controller('user')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Put('follow/:followeeId')
  @UseGuards(AuthGuard(), NotMySelfGuard)
  public async follow(
    @Param('followeeId', ValidateIdPipe) followeeId: ID,
    @GetUser() user: any,
  ) {
    return { followeeId, user };
  }
}
