import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ObjectId } from 'mongodb';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { AddReactionDto } from '@/reaction/dto/requests/add-reaction.dto';
import {
  AddReactionData,
  ReactionJobData,
} from '@/reaction/interfaces/reaction.interface';

@Injectable()
export class ReactionService {
  constructor(
    @InjectQueue('reaction')
    private readonly reactionQueue: Queue<ReactionJobData>,
  ) {}

  /**
   * Add reaction to post
   * @param addReactionDto Reaction data
   * @param user User who reacts to post
   */
  create(addReactionDto: AddReactionDto, user: CurrentUser): void {
    const reactionData: AddReactionData = {
      postId: addReactionDto.postId,
      feeling: addReactionDto.feeling,
      avatarColor: user.avatarColor,
      username: user.username,
      profilePicture: addReactionDto.profilePicture,
    };

    this.reactionQueue.add('addPostReaction', {
      reaction: reactionData,
      previousFeeling: addReactionDto.previousFeeling,
    });
  }

  remove(postId: ObjectId, username: string): void {
    this.reactionQueue.add('removePostReaction', {
      postId,
      username,
    });
  }
}
