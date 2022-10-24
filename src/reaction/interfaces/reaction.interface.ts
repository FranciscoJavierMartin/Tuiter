import { ObjectId } from 'mongodb';

export enum Feelings {
  angry = 'angry',
  happy = 'happy',
  like = 'like',
  love = 'love',
  sad = 'sad',
  wow = 'wow',
}

export type Reactions = Record<Feelings, number>;

export type ReactionJobData = AddReactionJobData | RemoveReactionJobData;

export interface AddReactionJobData {
  reaction: AddReactionData;
  previousFeeling?: Feelings;
}

export interface AddReactionData {
  postId: ObjectId;
  feeling: Feelings;
  avatarColor: string;
  username: string;
  profilePicture: string;
}

export interface RemoveReactionJobData {
  postId: ObjectId;
  username: string;
}
