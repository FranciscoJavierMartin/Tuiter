import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatService } from '@/chat/chat.service';
import { AddMessageDto } from '@/chat/dto/requests/add-message.dto';
import { NotMySelfGuard } from '@/chat/guards/not-my-self.guard';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(AuthGuard())
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  @UseGuards(NotMySelfGuard)
  public async addMessage(@Body() addMessage: AddMessageDto) {
    return addMessage;
  }
}
