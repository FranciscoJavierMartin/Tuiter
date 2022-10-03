import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'User',
})
export class User {}

export const UserSchema = SchemaFactory.createForClass(User);
