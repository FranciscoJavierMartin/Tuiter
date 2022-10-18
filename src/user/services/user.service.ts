import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { AuthDocument } from '@/auth/models/auth.model';
import { UserDocument } from '@/user/models/user.model';
import { UserRepository } from '@/user/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Transform AuthDocument in UserDocument. Only for new users
   * @param data Auth user data
   * @param userObjectId user id to be created in DB
   * @returns User from auth
   */
  public getUserData(data: AuthDocument, userObjectId: ObjectId): UserDocument {
    const { _id, username, email, uId, password, avatarColor } = data;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username,
      email,
      password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageVersion: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true,
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
      },
    } as unknown as UserDocument;
  }
}
