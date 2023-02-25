import { Mutation, Resolver } from '@nestjs/graphql';
import { BlockUserService } from '@/block-user/services/block-user.service';
import { InfoMessageDto } from '@/auth/dto/responses/info-message.dto';

@Resolver()
export class BlockUserResolver {
  constructor(private readonly blockUserService: BlockUserService) {}

  @Mutation(() => InfoMessageDto, {
    name: 'blockUser',
    description: 'Block user',
  })
  public async block(): Promise<InfoMessageDto> {
    return {
      message: 'User blocked',
    };
  }
}
