import { Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { ID } from '@/shared/interfaces/types';
import { BlockUserService } from '@/block-user/block-user.service';
import { AuthGuard } from '@nestjs/passport';
import { NotMySelfGuard } from '@/follower/guards/not-my-self.guard';

@ApiTags('Block user')
@Controller('user')
export class BlockUserController {
  constructor(private readonly blockUserService: BlockUserService) {}

  @Put('block/:followerId')
  @UseGuards(AuthGuard(), NotMySelfGuard)
  public block(@Param('followerId', ValidateIdPipe) followerId: ID) {
    return followerId;
  }
}
