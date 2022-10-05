import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { UserCacheService } from '../user/services/user.cache.service';
import { UploaderService } from './services/uploader.service';

@Module({
  imports: [],
  providers: [
    UserCacheService,
    {
      inject: [ConfigService],
      provide: 'Cloudinary',
      useFactory: (configService: ConfigService) => {
        return v2.config({
          cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get('CLOUDINARY_API_KEY'),
          api_secret: configService.get('CLOUDINARY_API_SECRET'),
        });
      },
    },
    UploaderService,
  ],
  exports: [UserCacheService, UploaderService],
})
export class SharedModule {}
