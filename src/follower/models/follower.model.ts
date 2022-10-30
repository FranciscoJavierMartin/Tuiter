import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Schema({
  collection: 'Follower',
})
export class Follower {
  _id: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  })
  followerId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  })
  followeeId: mongoose.Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date = new Date();
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);
