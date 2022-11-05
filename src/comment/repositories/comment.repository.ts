import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { EmailService } from '@/email/services/email.service';
import { NotificationService } from '@/notification/notification.service';
import { NotificationType } from '@/notification/interfaces/notification.interface';
import { Post } from '@/post/models/post.model';
import { PostRepository } from '@/post/repositories/post.repository';
import { UserDocument } from '@/user/models/user.model';
import { UserRepository } from '@/user/repositories/user.repository';
import { AddCommentJobData } from '@/comment/interfaces/comment.interface';
import { Comment } from '@/comment/models/comment.model';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService,
  ) {}

  public async addCommentToDB({
    comment,
    postId,
    userFrom,
    userTo,
    username,
  }: AddCommentJobData): Promise<void> {
    const [commentCreated, post, user]: [Comment, Post, UserDocument] =
      await Promise.all([
        this.commentModel.create(comment),
        this.postRepository.incrementCommentsCount(postId),
        this.userRepository.getUserById(userTo),
      ]);

    if (user.notifications.comments && userFrom !== userTo) {
      const notifications = await this.notificationService.insertNotification({
        userFrom,
        userTo,
        message: `${username} commented on your post`,
        notificationType: NotificationType.comments,
        entityId: postId,
        createdItemId: commentCreated._id,
        createdAt: new Date(),
        comment: comment.text,
        post: post.text,
        imgId: post.imgId,
        imgVersion: post.imgVersion,
        gifUrl: post.gifUrl,
        reaction: '',
      });

      // TODO: emit 'insert notification'

      this.emailService.sendNotificationEmail(
        user.email,
        `${username} commented on your post`,
        user.username,
        `${username} commented on your post`,
        'Comment notification',
      );
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
