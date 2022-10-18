import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bull';
import { PostService } from '@/post/services/post.service';
import { PostController } from '@/post/post.controller';
import { Post, PostSchema } from '@/post/models/post.schema';
import { PostCacheService } from '@/post/services/post.cache.service';
import { PostConsumer } from '@/post/consumer/post.consumer';
import { PostRepository } from './repositories/post.repository';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BullModule.registerQueue({
      name: 'post',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 5000,
        },
        removeOnComplete: true,
      },
    }),
    UserModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostCacheService, PostConsumer, PostRepository],
})
export class PostModule {}
