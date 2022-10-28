import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bull';
import { DEFAULT_JOB_OPTIONS } from '@/shared/contants';
import { UserModule } from '@/user/user.module';
import { PostService } from '@/post/services/post.service';
import { PostController } from '@/post/post.controller';
import { Post, PostSchema } from '@/post/models/post.model';
import { PostCacheService } from '@/post/services/post.cache.service';
import { PostConsumer } from '@/post/consumer/post.consumer';
import { PostRepository } from '@/post/repositories/post.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BullModule.registerQueue({
      name: 'post',
      defaultJobOptions: DEFAULT_JOB_OPTIONS,
    }),
    UserModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostCacheService, PostConsumer, PostRepository],
  exports: [PostRepository],
})
export class PostModule {}
