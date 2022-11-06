import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ID } from '@/shared/interfaces/types';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { CommentService } from '@/comment/services/comment.service';
import { CreateCommentDto } from '@/comment/dto/requests/create-comment.dto';
import { CommentDto } from '@/comment/dto/responses/comment.dto';

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

  @Get(':postId')
  @ApiParam({
    name: 'postId',
    description: 'Post id where comments belong',
    example: '6355a7e4837b68783f4c7af3',
    required: true,
  })
  @ApiOkResponse({
    description: 'Comments which belong to post',
    type: [CommentDto],
  })
  public async findByPostId(
    @Param('postId', ValidateIdPipe) postId: ID,
  ): Promise<CommentDto[]> {
    return this.commentService.findByPostId(postId);
  }
}
