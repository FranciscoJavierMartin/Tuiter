import { Module } from '@nestjs/common';
import { PostService } from '@/post/post.service';
import { PostController } from '@/post/post.controller';
import { Post, PostSchema } from '@/post/models/post.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
