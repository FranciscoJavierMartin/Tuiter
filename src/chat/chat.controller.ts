import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatService } from '@/chat/chat.service';
import { AddMessageDto } from '@/chat/dto/requests/add-message.dto';
import { NotMySelfGuard } from '@/chat/guards/not-my-self.guard';
import { NotBlockedGuard } from '@/chat/guards/not-blocked.guard';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(AuthGuard())
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  @UseGuards(NotMySelfGuard, NotBlockedGuard)
  public async addMessage(
    @Body() addMessageDto: AddMessageDto,
    @GetUser() currentUser: CurrentUser,
  ) {
    // TODO: Get chat from sender and receiver
    return this.chatService.addMessage(addMessageDto, currentUser);
  }
}
