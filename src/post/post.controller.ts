import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  ParseFilePipe,
  UseInterceptors,
  MaxFileSizeValidator,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from '@/post/dto/requests/create-post.dto';
import { PostService } from '@/post/post.service';
import { UpdatePostDto } from './dto/requests/update-post.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePostDto })
  @ApiBearerAuth()
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

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
