import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { ID } from '@/shared/interfaces/types';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { NotMySelfGuard } from '@/follower/guards/not-my-self.guard';
import { BlockUserService } from '@/block-user/services/block-user.service';

@ApiTags('Block user')
@Controller('user')
export class BlockUserController {
  constructor(private readonly blockUserService: BlockUserService) {}

  @Patch('block/:followerId')
  @UseGuards(AuthGuard(), NotMySelfGuard)
  public async block(
    @Param('followerId', ValidateIdPipe) followerId: ID,
    @GetUser('userId') [userId]: string,
  ) {
    return await this.blockUserService.block(
      userId as unknown as ID,
      followerId,
    );
  }

  @Patch('unblock/:followerId')
  @UseGuards(AuthGuard(), NotMySelfGuard)
  public async unblock(
    @Param('followerId', ValidateIdPipe) followerId: ID,
    @GetUser('userId') [userId]: string,
  ) {
    return await this.blockUserService.unblock(
      userId as unknown as ID,
      followerId,
    );
  }
}
