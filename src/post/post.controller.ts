import {
  Controller,
  Post,
  Body,
  UploadedFile,
  ParseFilePipe,
  UseInterceptors,
  MaxFileSizeValidator,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { PostService } from '@/post/services/post.service';
import { CreatePostDto } from '@/post/dto/requests/create-post.dto';
import { PostsDto } from '@/post/dto/responses/posts.dto';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { IsAuthorGuard } from './decorators/is-author.guard';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePostDto })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Post created',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiBadGatewayResponse({
    description: 'Error on internal request',
  })
  @UseGuards(AuthGuard())
  create(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: CurrentUser,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new MaxFileSizeValidator({ maxSize: 50 * 1000 * 1000 })],
      }),
    )
    image?: Express.Multer.File,
  ) {
    return this.postService.create(createPostDto, user, image);
  }

  @Get(':page')
  @ApiOkResponse({
    description: 'Get all posts',
    type: PostsDto,
  })
  findAll(@Param('page', ParseIntPipe) page: number): Promise<PostsDto> {
    return this.postService.getAllPosts(page);
  }

  @Delete(':postId')
  @ApiOkResponse({
    description: 'Remove post. Only for author',
  })
  @UseGuards(AuthGuard(), IsAuthorGuard)
  remove(
    @Param('postId', ValidateIdPipe) postId: string,
    @GetUser('userId') [userId]: string,
  ) {
    return this.postService.remove(postId, userId);
  }
}
