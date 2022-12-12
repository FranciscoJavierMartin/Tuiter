import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SharedModule } from '@/shared/shared.module';
import { LoggerMiddleware } from '@/shared/middlewares/logger.middleware';
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
import { ChatModule } from '@/chat/chat.module';
import { HealthModule } from '@/health/health.module';

// TODO: Add API KEY to each request. For avoid third party request
// TODO: Add JSDoc return type properly
// TODO: Idea. Add "tip" button to give a tip to user (Real money)
// TODO: Refresh token
// TODO: Idea. Add fixed post to the start of list
// TODO: Use decorator composition to reducer the ammount of decorators per route https://docs.nestjs.com/custom-decorators
// TODO: Add logic to find connected users
// TODO: Check email notifications according to user preferences
// TODO: Update type in Swagger response tags
// TODO: Update error messages in catch from redis services
// TODO: Add more swagger tags to auth endpoints
// TODO: Add isArray to swagger response when returned type is array
// TODO: Fix email image
// TODO: Add more complex password
// TODO: Study if uId could be removed from auth model
// TODO: Document Chat module
// TODO: When retrieve data from db instead of cache, then update cache data
// TODO: Include 'writting' in chat
// TODO: Check if guards has sense with always return a 403 error
// TODO: Move to fastify instead of express
// TODO: Move cache services to repositories folder
// TODO: Use interfaces to access to repository services (just for DB services)
// TODO: Setup Docker for development, testing and production environment
// TODO: Setup tests
// TODO: Setup Github Actions for CI/CD
// TODO: Setup SMTP server in docker-compose

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), '@/schema.gql'),
      sortSchema: true,
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
    ChatModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
