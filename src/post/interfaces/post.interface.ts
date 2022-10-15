import { ObjectId } from 'mongodb';

export enum Privacy {
  Public = 'Public',
  Private = 'Private',
}

export enum Feelings {
  angry = 'angry',
  happy = 'happy',
  like = 'like',
  love = 'love',
  sad = 'sad',
  wow = 'wow',
}

export interface GetPostsQuery {
  _id?: ObjectId | string;
  username?: string;
  imgId?: string;
  gifUrl?: string;
}
