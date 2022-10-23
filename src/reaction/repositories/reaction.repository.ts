import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction } from '@/reaction/models/reaction.schema';
import { AddReactionData } from '@/reaction/interfaces/reaction.interface';
import { Feelings } from '@/post/interfaces/post.interface';

@Injectable()
export class ReactionRepository {
  constructor(
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
  ) {}

  public async saveReaction(
    reaction: AddReactionData,
    previousFeeling?: Feelings,
  ) {
    await this.reactionModel.replaceOne(
      {
        postId: reaction.postId,
        feeling: previousFeeling,
        username: reaction.username,
      },
      reaction,
      { upsert: true },
    );
  }
}
