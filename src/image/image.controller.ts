import {
  Controller,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ID } from '@/shared/interfaces/types';
import { FILE_SIZE_LIMIT } from '@/shared/contants';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { ImageService } from '@/image/image.service';

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
  @UseGuards(AuthGuard())
  public async uploadProfilePicture(
    @UploadedFile(new ParseFilePipe({})) image: Express.Multer.File,
    @GetUser('userId') userId: ID,
  ) {
    return userId;
    // await this.imageService.uploadProfilePicture(image, string2ID(userId));
  }
}
