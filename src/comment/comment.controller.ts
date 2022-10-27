import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { CommentService } from '@/comment/services/comment.service';
import { CreateCommentDto } from '@/comment/dto/requests/create-comment.dto';

@ApiTags('Comment')
@Controller('post/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiBody({ type: CreateCommentDto })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Comment created',
  })
  public async create(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: CurrentUser,
  ): Promise<void> {
    return this.commentService.create(createCommentDto, user);
  }
}
