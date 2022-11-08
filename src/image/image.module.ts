import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { getQueues } from '@/helpers/utils';
import { User, UserSchema } from '@/user/models/user.model';
import { UserModule } from '@/user/user.module';
import { ImageService } from '@/image/image.service';
import { ImageController } from '@/image/image.controller';
import { ImageConsumer } from '@/image/consumers/image.consumer';
import { ImageRepository } from '@/image/repositories/image.repository';
import { Image, ImageSchema } from '@/image/models/image.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Image.name, schema: ImageSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BullModule.registerQueue(...getQueues('image')),
    UserModule,
  ],
  controllers: [ImageController],
  providers: [ImageService, ImageConsumer, ImageRepository],
})
export class ImageModule {}
