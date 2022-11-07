import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ImageService } from '@/image/image.service';
import { ImageController } from '@/image/image.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
