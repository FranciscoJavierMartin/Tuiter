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
import { NotBlockedGuard } from '@/chat/guards/not-blocked.guard';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { ID } from '@/shared/interfaces/types';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(AuthGuard())
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // @Post('message/:receiverId')
  // @UseInterceptors(FileInterceptor('image'))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({ type: AddMessageDto })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard(), NotMySelfGuard, NotBlockedGuard)
  // public async addMessage(
  //   @Param('receiverId', ValidateIdPipe) receiverId: ID,
  //   @Body() addMessageDto: AddMessageDto,
  //   @GetUser() currentUser: CurrentUser,
  //   // TODO: Extract in a shared decorator
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       fileIsRequired: false,
  //       validators: [new MaxFileSizeValidator({ maxSize: FILE_SIZE_LIMIT_MB })],
  //     }),
  //   )
  //   image?: Express.Multer.File,
  // ) {
  //   return image?.fieldname;
  //   // TODO: Get chat from sender and receiver
  //   // return this.chatService.addMessage(addMessageDto, currentUser);
  // }

  @Post('message/:receiverId')
  public async addMessage(@Param('receiverId', ValidateIdPipe) receiverId: ID) {
    return receiverId;
  }
}
