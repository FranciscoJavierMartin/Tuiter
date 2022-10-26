import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from '@/comment/services/comment.service';
import { CreateCommentDto } from '@/comment/dto/create-comment.dto';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { GetUser } from '@/auth/decorators/get-user.decorator';

@ApiTags('Comment')
@Controller('post/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard())
  public async create(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: CurrentUser,
  ): Promise<void> {
    return this.commentService.create(createCommentDto, user);
  }
}
