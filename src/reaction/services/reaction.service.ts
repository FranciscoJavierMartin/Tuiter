import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { AddReactionDto } from '@/reaction/dto/requests/add-reaction.dto';
import {
  AddReactionData,
  AddReactionJobData,
} from '@/reaction/interfaces/reaction.interface';

@Injectable()
export class ReactionService {
  constructor(
    @InjectQueue('reaction')
    private readonly reactionQueue: Queue<AddReactionJobData>,
  ) {}

  create(addReactionDto: AddReactionDto, user: CurrentUser) {
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
}
