import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigOptions, v2 } from 'cloudinary';
import { UploaderService } from '@/shared/services/uploader.service';

@Global()
@Module({
  imports: [],
  providers: [
    {
      inject: [ConfigService],
      provide: 'Cloudinary',
      useFactory: (configService: ConfigService): ConfigOptions => {
        return v2.config({
          cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get('CLOUDINARY_API_KEY'),
          api_secret: configService.get('CLOUDINARY_API_SECRET'),
        });
      },
    },
    UploaderService,
  ],
  exports: [UploaderService],
})
export class SharedModule {}
