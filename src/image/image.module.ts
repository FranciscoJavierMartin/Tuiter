import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bull';
import { getQueues } from '@/helpers/utils';
import { UserModule } from '@/user/user.module';
import { ImageService } from '@/image/image.service';
import { ImageController } from '@/image/image.controller';
import { ImageConsumer } from '@/image/consumers/image.consumer';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BullModule.registerQueue(...getQueues('image')),
    UserModule,
  ],
  controllers: [ImageController],
  providers: [ImageService, ImageConsumer],
})
export class ImageModule {}
