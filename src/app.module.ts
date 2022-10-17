import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { SharedModule } from '@/shared/shared.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: configService.get('SENDER_EMAIL'),
            pass: configService.get('SENDER_EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `Chatty App <${configService.get('SENDER_EMAIL')}>`,
        },
        template: {
          dir: __dirname + '/shared/emails/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    AuthModule,
    UserModule,
    SharedModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
