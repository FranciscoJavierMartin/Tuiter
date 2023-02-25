import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InfoMessageDto } from '@/shared/dto/responses/info-message.dto';
import { BlockUserService } from '@/block-user/services/block-user.service';

@Resolver()
export class BlockUserResolver {
  constructor(private readonly blockUserService: BlockUserService) {}

  @Mutation(() => InfoMessageDto, {
    name: 'blockUser',
    description: 'Block user',
  })
  public async block(
    @Args('followerId') followerId: string,
  ): Promise<InfoMessageDto> {
    console.log(followerId);
    return {
      message: 'User blocked',
    };
  }
}
