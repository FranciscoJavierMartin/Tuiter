import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CommentService } from '@/comment/services/comment.service';
import { CommentController } from '@/comment/comment.controller';
import { CommentCacheService } from '@/comment/services/comment.cache.service';
import { Comment, CommentSchema } from '@/comment/models/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentCacheService],
})
export class CommentModule {}
