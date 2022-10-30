import { Controller, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FollowerService } from './follower.service';

@ApiTags('Follow')
@Controller('user')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Put('follow/:followeeId')
  public async follow(@Param('followeeId') followeeId: string) {
    return followeeId;
  }
}
