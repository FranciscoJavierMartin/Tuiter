import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '@/auth/guards/gql-auth.guard';
import { ChatService } from '@/chat/chat.service';
import { InfoMessageDto } from '@/shared/dto/responses/info-message.dto';

@Resolver()
@UseGuards(GqlAuthGuard)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => InfoMessageDto, {
    name: 'addMessage',
    description: 'Add a message',
  })
  public async addMessage(): Promise<InfoMessageDto> {
    return {
      message: 'Message added',
    };
  }
}
