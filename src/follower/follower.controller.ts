import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FollowerService } from './follower.service';

@ApiTags('Follow')
@Controller('user/follow')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}
}
