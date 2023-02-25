import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { InfoMessageDto } from '@/shared/dto/responses/info-message.dto';
import { ID as Id } from '@/shared/interfaces/types';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { GqlAuthGuard } from '@/auth/guards/gql-auth.guard';
import { GetUserGql } from '@/auth/decorators/get-user-gql.decorator';
import { BlockUserService } from '@/block-user/services/block-user.service';

@Resolver()
export class BlockUserResolver {
  constructor(private readonly blockUserService: BlockUserService) {}

  @Mutation(() => InfoMessageDto, {
    name: 'blockUser',
    description: 'Block user',
  })
  @UseGuards(GqlAuthGuard)
  public async block(
    @Args('followerId', { type: () => ID }, ValidateIdPipe) followerId: Id,
    @GetUserGql('userId') userId: Id,
  ): Promise<InfoMessageDto> {
    console.log(followerId, userId);
    return {
      message: 'User blocked',
    };
  }
}
