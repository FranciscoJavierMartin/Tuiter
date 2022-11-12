import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SharedModule } from '@/shared/shared.module';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { PostModule } from '@/post/post.module';
import { ReactionModule } from '@/reaction/reaction.module';
import { CommentModule } from '@/comment/comment.module';
import { FollowerModule } from '@/follower/follower.module';
import { BlockUserModule } from '@/block-user/block-user.module';
import { NotificationModule } from '@/notification/notification.module';
import { EmailModule } from '@/email/email.module';
import { ImageModule } from '@/image/image.module';

// TODO: Move to fastify instead of express
// TODO: Move cache services to repositories folder
// TODO: Use interfaces to access to repository services (just for DB services)
// TODO: Setup tests
// TODO: Setup Github Actions for CI/CD
// TODO: Setup SMTP server in docker-compose

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
          from: `Tuiter App <${configService.get('SENDER_EMAIL')}>`,
        },
        template: {
          // TODO: Extract CSS
          dir: __dirname + '/email/templates',
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
    ReactionModule,
    CommentModule,
    FollowerModule,
    BlockUserModule,
    NotificationModule,
    EmailModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
