import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { PostService } from '@/post/services/post.service';
import { PostController } from '@/post/post.controller';
import { Post, PostSchema } from '@/post/models/post.schema';
import { PostCacheService } from '@/post/services/post.cache.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [PostController],
  providers: [PostService, PostCacheService],
})
export class PostModule {}
