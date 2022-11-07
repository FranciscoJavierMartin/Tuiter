import { Module } from '@nestjs/common';
import { ImageService } from '@/image/image.service';
import { ImageController } from '@/image/image.controller';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
