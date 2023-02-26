import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { InfoMessageDto } from '@/shared/dto/responses/info-message.dto';
import { ID as Id } from '@/shared/interfaces/types';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { GqlAuthGuard } from '@/auth/guards/gql-auth.guard';
import { GetUserGql } from '@/auth/decorators/get-user-gql.decorator';
import { NotMySelfGuard } from '@/follower/guards/graphql/not-my-self.guard';
import { BlockUserService } from '@/block-user/services/block-user.service';

@Resolver()
export class BlockUserResolver {
  constructor(private readonly blockUserService: BlockUserService) {}

  @Mutation(() => InfoMessageDto, {
    name: 'blockUser',
    description: 'Block user',
  })
  @UseGuards(GqlAuthGuard, NotMySelfGuard)
  public async block(
    @Args('followerId', { type: () => ID }, ValidateIdPipe) followerId: Id,
    @GetUserGql('userId') userId: Id,
  ): Promise<InfoMessageDto> {
    await this.blockUserService.block(userId, followerId);
    return {
      message: 'User blocked',
    };
  }

  @Mutation(() => InfoMessageDto, {
    name: 'unblockUser',
    description: 'Unblock user',
  })
  @UseGuards(GqlAuthGuard, NotMySelfGuard)
  public async unblock(
    @Args('followerId', { type: () => ID }, ValidateIdPipe) followerId: Id,
    @GetUserGql('userId') userId: Id,
  ): Promise<InfoMessageDto> {
    await this.blockUserService.unblock(userId, followerId);
    return {
      message: 'User unblocked',
    };
  }
}
