import {
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ID } from '@/shared/interfaces/types';
import { FILE_SIZE_LIMIT } from '@/shared/contants';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { ImageService } from '@/image/image.service';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Patch('profile')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fieldSize: FILE_SIZE_LIMIT,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  public async uploadProfilePicture(
    @UploadedFile(new ParseFilePipe({})) image: Express.Multer.File,
    @GetUser('userId') userId: ID,
  ): Promise<void> {
    await this.imageService.uploadProfilePicture(image, userId);
  }

  @Patch('background')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fieldSize: FILE_SIZE_LIMIT,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard())
  public async uploadBackgroundImage(
    @UploadedFile(new ParseFilePipe({})) image: Express.Multer.File,
    @GetUser('userId') userId: ID,
  ): Promise<void> {
    await this.imageService.uploadBackgroundImage(image, userId);
  }

  @Get(':userId')
  @ApiParam({
    name: 'userId',
    description: 'User id to get images',
  })
  public async getImages(@Param('userId', ValidateIdPipe) userId: ID) {
    return userId;
  }
}
