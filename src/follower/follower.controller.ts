import { Controller, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ID } from '@/shared/interfaces/types';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { FollowerService } from '@/follower/follower.service';

@ApiTags('Follow')
@Controller('user')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Put('follow/:followeeId')
  public async follow(@Param('followeeId', ValidateIdPipe) followeeId: ID) {
    return followeeId;
  }
}
