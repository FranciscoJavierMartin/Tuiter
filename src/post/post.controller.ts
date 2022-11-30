import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { DefaultImageOrVideoPipe } from '@/shared/pipes/validate-file.pipe';
import { ID } from '@/shared/interfaces/types';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { PostService } from '@/post/services/post.service';
import { CreatePostDto } from '@/post/dto/requests/create-post.dto';
import { PostsDto } from '@/post/dto/responses/posts.dto';
import { IsAuthorGuard } from '@/post/guards/is-author.guard';
import { UpdatePostDto } from '@/post/dto/requests/update-post.dto';

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
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiBadGatewayResponse({
    description: 'Error on internal request',
  })
  @UseGuards(AuthGuard())
  public async create(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: CurrentUser,
    @UploadedFile(DefaultImageOrVideoPipe)
    image?: Express.Multer.File,
  ): Promise<void> {
    return this.postService.create(createPostDto, user, image);
  }

  @Get(':page')
  @ApiParam({
    name: 'page',
    description: 'Page to retrieve',
  })
  @ApiOkResponse({
    description: 'Get all posts',
    type: PostsDto,
  })
  public async findAll(
    @Param('page', ParseIntPipe) page: number,
  ): Promise<PostsDto> {
    return this.postService.getAllPosts(page);
  }

  @Delete(':postId')
  @ApiParam({
    name: 'postId',
    description: 'Post id to remove',
  })
  @ApiOkResponse({
    description: 'Remove post. Only for author',
  })
  @ApiBadRequestResponse({
    description: 'Post not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'User is not post author',
  })
  @ApiBadGatewayResponse({
    description: 'Error on internal request',
  })
  @UseGuards(AuthGuard(), IsAuthorGuard)
  public async remove(
    // TODO: Replace string by ID
    @Param('postId', ValidateIdPipe) postId: string,
    @GetUser('userId') userId: ID,
  ): Promise<void> {
    return this.postService.remove(postId, userId);
  }

  @Put(':postId')
  @ApiParam({
    name: 'postId',
    description: 'Post id to update',
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Update post. Only for author',
  })
  @ApiBadRequestResponse({
    description: 'Post not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'User is not post author',
  })
  @ApiBadGatewayResponse({
    description: 'Error on internal request',
  })
  @UseGuards(AuthGuard(), IsAuthorGuard)
  public async update(
    @Param('postId', ValidateIdPipe) postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser('userId') authorId: ID,
    @UploadedFile(DefaultImageOrVideoPipe)
    image?: Express.Multer.File,
  ): Promise<void> {
    return this.postService.update(postId, updatePostDto, authorId, image);
  }
}
