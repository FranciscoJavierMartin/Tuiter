import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateResult, ObjectId } from 'mongodb';
import { Feelings } from '@/reaction/interfaces/reaction.interface';
import { Reaction } from '@/reaction/models/reaction.model';
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

  // TODO: Check if only the feeling could be retrieve
  /**
   * Remove reaction from DB
   * @param postId Post id asociated to reaction
   * @param username Username who react to post
   * @returns Reaction removed
   */
  public async removeReaction(
    postId: ObjectId,
    username: string,
  ): Promise<Reaction> {
    return await this.reactionModel.findOneAndDelete(
      { postId, username },
      { new: true },
    );
  }
}
