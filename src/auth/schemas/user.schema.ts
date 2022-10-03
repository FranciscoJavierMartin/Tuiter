import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { hashSync } from 'bcryptjs';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  avatarColor: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (this: User, next: () => void) {
  const hashedPassword: string = hashSync(this.password, 10);
  this.password = hashedPassword;
  next();
});
