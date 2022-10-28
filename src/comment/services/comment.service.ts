import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { Queue } from 'bull';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { CreateCommentDto } from '@/comment/dto/requests/create-comment.dto';
import { CommentCacheService } from '@/comment/services/comment.cache.service';
import { Comment } from '@/comment/models/comment.model';
import { CommentJobData } from '@/comment/interfaces/comment.interface';
import { ID } from '@/shared/interfaces/types';
import { CommentRepository } from '../repositories/comment.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentCacheService: CommentCacheService,
    private readonly commentRepository: CommentRepository,
    @InjectQueue('comment')
    private readonly commentQueue: Queue<CommentJobData>,
  ) {}

  /**
   * Save comment
   * @param createCommentDto Comment data to be saved
   * @param user Comment's author
   */
  public async create(
    createCommentDto: CreateCommentDto,
    user: CurrentUser,
  ): Promise<void> {
    const commentId: ID = new ObjectId();
    const postId: ID = createCommentDto.postId;

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

  public async findByPostId(postId: ID) {
    const cachedComments: Comment[] =
      await this.commentCacheService.getCommentsFromCache(postId);
    const comments: Comment[] = cachedComments.length
      ? cachedComments
      : await this.commentRepository.getPostComments(postId);

    return comments;
  }
}
