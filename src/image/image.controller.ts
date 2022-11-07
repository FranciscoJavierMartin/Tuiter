import {
  Controller,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from '@/image/image.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_SIZE_LIMIT } from '@/shared/contants';

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
  public async uploadProfilePicture(
    @UploadedFile(new ParseFilePipe({})) image: Express.Multer.File,
  ) {
    
  }
}
