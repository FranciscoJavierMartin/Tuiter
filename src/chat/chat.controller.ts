import {
  Body,
  Controller,
  Delete,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FILE_SIZE_LIMIT_MB } from '@/shared/contants';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { ID } from '@/shared/interfaces/types';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { ChatService } from '@/chat/chat.service';
import { AddMessageDto } from '@/chat/dto/requests/add-message.dto';
import { AddReactionDto } from '@/chat/dto/requests/add-reaction.dto';
import { NotMySelfGuard } from '@/chat/guards/not-my-self.guard';
import { CanChatGuard } from '@/chat/guards/can-chat.guard';
import { NotAuthorGuard } from '@/chat/guards/not-author.guard';
import { WithReactionGuard } from '@/chat/guards/with-reaction.guard';
import { RemoveReactionDto } from '@/chat/dto/requests/remove-reaction.dto';
import { MarkAsReadDto } from '@/chat/dto/requests/mark-as-read.dto';
import { MarkMessageAsDeletedDto } from '@/chat/dto/requests/mark-as-deleted.dto';
import { IsChatMemberGuard } from '@/chat/guards/is-chat-member.guard';

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

  @Patch('message/add-reaction')
  @ApiBearerAuth()
  @ApiBody({ type: AddMessageDto })
  @UseGuards(AuthGuard(), NotAuthorGuard)
  public async addReaction(
    @Body() addReactionDto: AddReactionDto,
  ): Promise<void> {
    await this.chatService.addReaction(addReactionDto);
  }

  @Patch('message/remove-reaction')
  @ApiBearerAuth()
  @ApiBody({ type: RemoveReactionDto })
  @UseGuards(AuthGuard(), NotAuthorGuard, WithReactionGuard)
  public async removeReaction(
    @Body() removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    await this.chatService.removeReaction(removeReactionDto);
  }

  // TODO: Check params and guards are the corrects
  // TODO: Rename to markMessageAsRead
  @Patch('message/mark-as-read')
  @ApiBearerAuth()
  @ApiBody({ type: MarkAsReadDto })
  @UseGuards(AuthGuard(), NotAuthorGuard)
  public async markAsRead(
    @Body() markAsReadDto: MarkAsReadDto,
    @GetUser('userId') userId: ID,
  ): Promise<void> {
    await this.chatService.markAsRead(markAsReadDto);
  }

  @Delete('message/mark-as-deleted')
  @ApiBearerAuth()
  @ApiBody({ type: MarkMessageAsDeletedDto })
  @UseGuards(AuthGuard(), CanChatGuard, IsChatMemberGuard)
  public async markMessageAsDeleted(
    @Body() markMessageAsDeletedDto: MarkMessageAsDeletedDto,
  ): Promise<void> {
    await this.chatService.markMessageAsDeleted(markMessageAsDeletedDto);
  }
}
