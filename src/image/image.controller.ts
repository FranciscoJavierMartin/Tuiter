import {
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ID } from '@/shared/interfaces/types';
import { FILE_SIZE_LIMIT } from '@/shared/contants';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { ImageService } from '@/image/image.service';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { ImageDto } from '@/image/dto/responses/image.dto';
import { IsOwnerGuard } from './guards/is-owner.guard';

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
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
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
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
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
  public async getImages(
    @Param('userId', ValidateIdPipe) userId: ID,
  ): Promise<ImageDto[]> {
    return await this.imageService.getImages(userId);
  }

  @Delete('background')
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  public async removeBackgroundImage(
    @GetUser('userId') userId: ID,
  ): Promise<void> {
    await this.imageService.removeBackgroundImage(userId);
  }

  @Delete(':imageId')
  @ApiParam({
    name: 'imageId',
    description: 'Image id',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({
    description: 'User is not image owner',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), IsOwnerGuard)
  public async removeImage(
    @Param('imageId', ValidateIdPipe) imageId: ID,
  ): Promise<void> {
    await this.imageService.removeImage(imageId);
  }
}
