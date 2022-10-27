import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bull';
import { CommentService } from '@/comment/services/comment.service';
import { CommentController } from '@/comment/comment.controller';
import { CommentCacheService } from '@/comment/services/comment.cache.service';
import { Comment, CommentSchema } from '@/comment/models/comment.schema';
import { CommentRepository } from './repositories/comment.repository';
import { DEFAULT_JOB_OPTIONS } from '@/shared/contants';
import { CommentConsumer } from './consumer/comment.consumer';
import { PostModule } from '@/post/post.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BullModule.registerQueue({
      name: 'comment',
      defaultJobOptions: DEFAULT_JOB_OPTIONS,
    }),
    PostModule,
    UserModule,
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    CommentCacheService,
    CommentConsumer,
    CommentRepository,
  ],
  exports: [CommentRepository],
})
export class CommentModule {}
