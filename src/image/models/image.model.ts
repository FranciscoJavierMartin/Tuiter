import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Schema({
  collection: 'Image',
})
export class Image {
  _id: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  })
  ownerId: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    default: '',
  })
  imgId: string;

  @Prop({
    type: String,
    default: '',
  })
  imgVersion: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date = new Date();
}

export const ImageSchema = SchemaFactory.createForClass(Image);
