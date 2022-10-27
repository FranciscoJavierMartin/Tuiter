import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { CreateCommentDto } from '@/comment/dto/create-comment.dto';
import { CommentCacheService } from '@/comment/services/comment.cache.service';
import { Comment } from '@/comment/models/comment.schema';
import mongoose from 'mongoose';

@Injectable()
export class CommentService {
  constructor(private readonly commentCacheService: CommentCacheService) {}

  public async create(
    createCommentDto: CreateCommentDto,
    user: CurrentUser,
  ): Promise<void> {
    const commentId = new ObjectId();

    const commentData: Comment = {
      _id: commentId,
      postId: createCommentDto.postId as mongoose.Types.ObjectId,
      username: user.username,
      avatarColor: user.avatarColor,
      profilePicture: createCommentDto.profilePicture,
      text: createCommentDto.text,
      createdAt: new Date(),
    };

    await this.commentCacheService.savePostCommentToCache(
      createCommentDto.postId,
      JSON.stringify(commentData),
    );
  }
}
