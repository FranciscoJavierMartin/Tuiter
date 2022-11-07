import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiParam({
    name: 'followerId',
    example: '6355a7e4837b68783f4c7af3',
    required: true,
    description: 'User who will be blocked id',
  })
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: 'User is already blocked',
  })
  @UseGuards(AuthGuard(), NotMySelfGuard)
  public async block(
    @Param('followerId', ValidateIdPipe) followerId: ID,
    @GetUser('userId') userId: ID,
  ): Promise<void> {
    await this.blockUserService.block(userId, followerId);
  }

  @Patch('unblock/:followerId')
  @ApiParam({
    name: 'followerId',
    example: '6355a7e4837b68783f4c7af3',
    required: true,
    description: 'User who will be unblocked id',
  })
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: 'User is not blocked',
  })
  @UseGuards(AuthGuard(), NotMySelfGuard)
  public async unblock(
    @Param('followerId', ValidateIdPipe) followerId: ID,
    @GetUser('userId') [userId]: string,
  ): Promise<void> {
    await this.blockUserService.unblock(userId as unknown as ID, followerId);
  }
}
