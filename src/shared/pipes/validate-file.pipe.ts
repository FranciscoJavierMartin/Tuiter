import { MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';
import { FILE_SIZE_LIMIT_MB } from '@/shared/contants';

export const DefaultFilePipe = new ParseFilePipe({
  fileIsRequired: false,
  validators: [new MaxFileSizeValidator({ maxSize: FILE_SIZE_LIMIT_MB })],
});
