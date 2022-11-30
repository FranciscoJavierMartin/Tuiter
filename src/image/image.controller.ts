import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ID } from '@/shared/interfaces/types';
import { DefaultFilePipe } from '@/shared/pipes/validate-file.pipe';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { ImageService } from '@/image/image.service';
import { ImageDto } from '@/image/dto/responses/image.dto';
import { IsOwnerGuard } from '@/image/guards/is-owner.guard';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  // TODO: Check if should be included in user controller
  @Patch('profile')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiBadGatewayResponse({
    description: 'External server error',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  public async uploadProfilePicture(
    @UploadedFile(DefaultFilePipe) image: Express.Multer.File,
    @GetUser('userId') userId: ID,
  ): Promise<void> {
    await this.imageService.uploadProfilePicture(image, userId);
  }

  // TODO: Check if should be included in user controller
  @Patch('background')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiBadGatewayResponse({
    description: 'External server error',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  public async uploadBackgroundImage(
    @UploadedFile(DefaultFilePipe)
    image: Express.Multer.File,
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

  // TODO: Check if should be included in user controller
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
  @ApiNotFoundResponse({
    description: 'Image not found',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), IsOwnerGuard)
  public async removeImage(
    @Param('imageId', ValidateIdPipe) imageId: ID,
  ): Promise<void> {
    await this.imageService.removeImage(imageId);
  }
}
