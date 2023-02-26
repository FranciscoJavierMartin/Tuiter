import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { InfoMessageDto } from '@/shared/dto/responses/info-message.dto';
import { ID as Id } from '@/shared/interfaces/types';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { GqlAuthGuard } from '@/auth/guards/gql-auth.guard';
import { ChatService } from '@/chat/chat.service';

@Resolver()
@UseGuards(GqlAuthGuard)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => InfoMessageDto, {
    name: 'addMessage',
    description: 'Add a message',
  })
  public async addMessage(
    @Args('receiverId', { type: () => ID }, ValidateIdPipe) receiverId: Id,
  ): Promise<InfoMessageDto> {
    console.log(receiverId);
    return {
      message: 'Message added',
    };
  }
}
