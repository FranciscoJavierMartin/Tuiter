import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { InfoMessageDto } from '@/shared/dto/responses/info-message.dto';
import { ID as Id } from '@/shared/interfaces/types';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { BlockUserService } from '@/block-user/services/block-user.service';

@Resolver()
export class BlockUserResolver {
  constructor(private readonly blockUserService: BlockUserService) {}

  @Mutation(() => InfoMessageDto, {
    name: 'blockUser',
    description: 'Block user',
  })
  public async block(
    @Args('followerId', { type: () => ID }, ValidateIdPipe) followerId: Id,
  ): Promise<InfoMessageDto> {
    console.log(followerId);
    return {
      message: 'User blocked',
    };
  }
}
