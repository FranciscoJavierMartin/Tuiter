import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { hashSync, compareSync } from 'bcryptjs';
import { firstLetterUppercase } from '../../helpers/utils';

const SALT_ROUND = 10;

export type AuthDocument = AuthUser & Document;

@Schema({
  collection: 'Auth',
  toJSON: {
    transform(_doc, ret) {
      delete ret.password;
      return ret;
    },
  },
})
export class AuthUser {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  uId: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  avatarColor: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: String, default: '' })
  passwordResetToken: string;

  @Prop({ type: Number })
  passwordResetExpires: number;
}

export const AuthSchema = SchemaFactory.createForClass(AuthUser);

AuthSchema.pre('save', function (this: AuthUser, next: () => void) {
  const hashedPassword: string = hashSync(this.password, 10);
  this.password = hashedPassword;
  this.email = this.email.toLowerCase();
  this.username = firstLetterUppercase(this.username);
  next();
});

AuthSchema.methods.comparePassword = function (password: string): boolean {
  const hashedPassword: string = (this as unknown as AuthDocument).password;
  return compareSync(password, hashedPassword);
};

AuthSchema.methods.hashPassword = function (password: string): string {
  return hashSync(password, SALT_ROUND);
};
