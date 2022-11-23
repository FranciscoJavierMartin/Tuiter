import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDocument, AuthUser } from '@/auth/models/auth.model';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(AuthUser.name) private authModel: Model<AuthDocument>,
  ) {}

  /**
   * Create auth user in DB
   * @param authUser auth user to be created
   */
  public async createAuthUser(authUser: AuthDocument): Promise<void> {
    const authUserCreated = new this.authModel({ ...authUser });
    await authUserCreated.save();
  }

  /**
   * Check if users exists in db by email or username
   * @param email
   * @param username
   * @returns True if user exists, False otherwise
   */
  public async checkIfUserExists(
    email: string,
    username: string,
  ): Promise<boolean> {
    return !!(await this.authModel
      .exists({
        $or: [{ username }, { email: email.toLowerCase() }],
      })
      .exec());
  }

  /**
   * Get auth user by username
   * @param username User name
   * @returns User from DB
   */
  public async getAuthUserByUsername(username: string): Promise<AuthDocument> {
    return await this.authModel.findOne({ username }).exec();
  }

  /**
   * Get auth user by email
   * @param email User email
   * @returns User from DB
   */
  public async getAuthUserByEmail(email: string): Promise<AuthDocument> {
    return await this.authModel
      .findOne({
        email: email.toLowerCase(),
      })
      .exec();
  }

  /**
   * Update password reset token
   * @param authId User id to be updated
   * @param passwordToken New password token
   */
  public async updatePasswordResetToken(
    authId: string,
    passwordToken: string,
  ): Promise<void> {
    await this.authModel.updateOne(
      {
        _id: authId,
      },
      {
        passwordResetToken: passwordToken,
        passwordResetExpires: Date.now() * 60 * 60 * 1000,
      },
    );
  }

  /**
   * Get auth user by password reset token
   * @param token Token to search user
   * @returns Auth user
   */
  public async getAuthUserByPasswordToken(
    token: string,
  ): Promise<AuthDocument> {
    return await this.authModel
      .findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
      })
      .exec();
  }
}
