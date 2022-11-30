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

  //TODO: Create index between imgId and imgVersion to get unique pairs of values
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
