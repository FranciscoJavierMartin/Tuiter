import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CommentService } from '@/comment/services/comment.service';
import { CommentController } from '@/comment/comment.controller';
import { CommentCacheService } from '@/comment/services/comment.cache.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [CommentController],
  providers: [CommentService, CommentCacheService],
})
export class CommentModule {}
