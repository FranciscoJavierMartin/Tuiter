import {
  Body,
  Controller,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FILE_SIZE_LIMIT_MB } from '@/shared/contants';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { ChatService } from '@/chat/chat.service';
import { AddMessageDto } from '@/chat/dto/requests/add-message.dto';
import { NotMySelfGuard } from '@/chat/guards/not-my-self.guard';
import { CanChatGuard } from '@/chat/guards/can-chat.guard';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { ID } from '@/shared/interfaces/types';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(AuthGuard())
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message/:receiverId')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({ type: AddMessageDto })
  @UseGuards(AuthGuard(), NotMySelfGuard, CanChatGuard)
  public async addMessage(
    @Param('receiverId', ValidateIdPipe) receiverId: ID,
    @Body() addMessageDto: AddMessageDto,
    @GetUser() currentUser: CurrentUser,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new MaxFileSizeValidator({ maxSize: FILE_SIZE_LIMIT_MB })],
      }),
    )
    image?: Express.Multer.File,
  ): Promise<void> {
    await this.chatService.addMessage(
      receiverId,
      addMessageDto,
      currentUser,
      image,
    );
  }
}
