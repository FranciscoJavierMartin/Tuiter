import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateResult } from 'mongodb';
import { Feelings } from '@/reaction/interfaces/reaction.interface';
import { Reaction } from '@/reaction/models/reaction.schema';
import { AddReactionData } from '@/reaction/interfaces/reaction.interface';

@Injectable()
export class ReactionRepository {
  constructor(
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
  ) {}

  /**
   * Save reaction in DB. If there is a previous, then replace it.
   * @param reaction Reaction to be saved
   * @param previousFeeling (Optional) Previous feeling
   * @returns Updated document
   */
  public async saveReaction(
    reaction: AddReactionData,
    previousFeeling?: Feelings,
  ): Promise<UpdateResult> {
    return await this.reactionModel.replaceOne(
      {
        postId: reaction.postId,
        feeling: previousFeeling,
        username: reaction.username,
      },
      reaction,
      { upsert: true, new: true },
    );
  }
}
