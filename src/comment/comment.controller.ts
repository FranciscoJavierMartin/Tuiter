import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from '@/comment/services/comment.service';
import { CreateCommentDto } from '@/comment/dto/create-comment.dto';

@ApiTags('Comment')
@Controller('post/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard())
  public async create(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<void> {
    return this.commentService.create(createCommentDto);
  }
}
