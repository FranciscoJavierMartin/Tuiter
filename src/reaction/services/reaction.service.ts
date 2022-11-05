import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ID } from '@/shared/interfaces/types';
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
  public create(addReactionDto: AddReactionDto, user: CurrentUser): void {
    const reactionData: AddReactionData = {
      postId: addReactionDto.postId,
      feeling: addReactionDto.feeling,
      avatarColor: user.avatarColor,
      username: user.username,
      profilePicture: user.profilePicture,
    };

    this.reactionQueue.add('addPostReaction', {
      reaction: reactionData,
      previousFeeling: addReactionDto.previousFeeling,
    });
  }

  /**
   * Remove reaction from post
   * @param postId Post id
   * @param username Username who react to post
   */
  public remove(postId: ID, username: string): void {
    this.reactionQueue.add('removePostReaction', {
      postId,
      username,
    });
  }
}
