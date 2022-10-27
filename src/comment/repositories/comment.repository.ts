import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '@/post/models/post.schema';
import { PostRepository } from '@/post/repositories/post.repository';
import { User } from '@/user/models/user.model';
import { UserRepository } from '@/user/repositories/user.repository';
import { AddCommentJobData } from '@/comment/interfaces/comment.interface';
import { Comment } from '@/comment/models/comment.schema';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async addCommentToDB({
    comment,
    postId,
    userFrom,
    userTo,
    username,
  }: AddCommentJobData): Promise<void> {
    const comments: Promise<Comment> = this.commentModel.create(comment);
    const post: Promise<Post> = this.postRepository.incrementPostCount(postId);
    const user: Promise<User> = this.userRepository.getUserById(
      userTo.toString(),
    );
    const response: [Comment, Post, User] = await Promise.all([
      comments,
      post,
      user,
    ]);

    // TODO: Send comments notifications
  }
}
