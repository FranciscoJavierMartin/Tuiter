import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Post } from '@/post/models/post.model';
import { PostRepository } from '@/post/repositories/post.repository';
import { User } from '@/user/models/user.model';
import { UserRepository } from '@/user/repositories/user.repository';
import { AddCommentJobData } from '@/comment/interfaces/comment.interface';
import { Comment } from '@/comment/models/comment.model';
import { NotificationService } from '@/notification/notification.service';
import { NotificationType } from '@/notification/interfaces/notification.interface';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationService,
  ) {}

  public async addCommentToDB({
    comment,
    postId,
    userFrom,
    userTo,
    username,
  }: AddCommentJobData): Promise<void> {
    const comments: Promise<Comment> = this.commentModel.create(comment);
    const post: Promise<Post> =
      this.postRepository.incrementCommentsCount(postId);
    const user: Promise<User> = this.userRepository.getUserById(userTo);
    const response: [Comment, Post, User] = await Promise.all([
      comments,
      post,
      user,
    ]);

    // TODO: Send comments notifications
    if (response[2].notifications.comments && userFrom !== userTo) {
      const notifications = await this.notificationService.insertNotification({
        userFrom,
        userTo,
        message: `${username} commented on your post`,
        notificationType: NotificationType.comments,
        entityId: postId,
        createdItemId: response[0]._id,
        createdAt: new Date(),
        comment: comment.text,
        post: response[1].text,
        imgId: response[1].imgId,
        imgVersion: response[1].imgVersion,
        gifUrl: response[1].gifUrl,
        reaction: '',
      });

      // TODO: emit 'insert notification'

      
    }
  }

  public async getPostComments(postId: ObjectId): Promise<Comment[]> {
    return await this.commentModel.aggregate([
      {
        $match: {
          postId,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
  }
}
