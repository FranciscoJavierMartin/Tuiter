import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { CreateCommentDto } from '@/comment/dto/requests/create-comment.dto';
import { CommentCacheService } from '@/comment/services/comment.cache.service';
import { Comment } from '@/comment/models/comment.schema';
import mongoose from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CommentJobData } from '../interfaces/comment.interface';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentCacheService: CommentCacheService,
    @InjectQueue('comment')
    private readonly commentQueue: Queue<CommentJobData>,
  ) {}

  public async create(
    createCommentDto: CreateCommentDto,
    user: CurrentUser,
  ): Promise<void> {
    const commentId: ObjectId = new ObjectId();
    const postId: ObjectId = createCommentDto.postId;

    const commentData: Comment = {
      _id: commentId,
      postId: postId as mongoose.Types.ObjectId,
      username: user.username,
      avatarColor: user.avatarColor,
      profilePicture: user.profilePicture,
      text: createCommentDto.text,
      createdAt: new Date(),
    };

    await this.commentCacheService.savePostCommentToCache(
      postId,
      JSON.stringify(commentData),
    );

    this.commentQueue.add('addCommentToDB', {
      postId,
      userTo: createCommentDto.userTo,
      userFrom: user.userId,
      username: user.username,
      comment: commentData,
    });
  }
}
