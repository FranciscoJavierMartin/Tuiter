import { Controller, Param, Put, UseGuards } from '@nestjs/common';
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

  @Put('block/:followerId')
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
}
