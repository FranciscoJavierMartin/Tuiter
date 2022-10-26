import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CommentService } from '@/comment/comment.service';
import { CommentController } from '@/comment/comment.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
