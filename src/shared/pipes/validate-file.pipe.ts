import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { FILE_SIZE_LIMIT_MB } from '@/shared/contants';

export const DefaultImagePipe = new ParseFilePipe({
  fileIsRequired: false,
  validators: [
    new MaxFileSizeValidator({ maxSize: FILE_SIZE_LIMIT_MB }),
    new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
  ],
});

export const DefaultImageOrVideoPipe = new ParseFilePipe({
  fileIsRequired: false,
  validators: [
    new MaxFileSizeValidator({ maxSize: FILE_SIZE_LIMIT_MB }),
    new FileTypeValidator({ fileType: /(jpg|jpeg|mp4|png|webp)$/ }),
  ],
});
