import { Injectable } from '@nestjs/common';
import { escapeRegexp } from '@/helpers/utils';
import { ID } from '@/shared/interfaces/types';
import { AuthService } from '@/auth/auth.service';
import { AuthDocument } from '@/auth/models/auth.model';
import { UserDocument } from '@/user/models/user.model';
import { UserRepository } from '@/user/repositories/user.repository';
import { UserDto } from '@/user/dto/responses/user.dto';
import { UserCacheService } from '@/user/services/user.cache.service';
import { SearchUserDto } from '@/user/dto/responses/search-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly userCacheService: UserCacheService,
  ) {}

  /**
   * Transform AuthDocument in UserDocument. Only for new users
   * @param data Auth user data
   * @param userObjectId user id to be created in DB
   * @returns User from auth
   */
  public getUserData(data: AuthDocument, userObjectId: ID): UserDocument {
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

  /**
   * Get profile by user id
   * @param userId User id
   * @returns User document (user model)
   */
  public async getProfileByUserId(userId: ID): Promise<UserDto> {
    const cachedUser: UserDocument =
      await this.userCacheService.getUserFromCache(userId);

    return new UserDto(
      cachedUser ?? (await this.userRepository.getUserById(userId)),
    );
  }

  /**
   * Get random users from data source
   * @returns Random users
   */
  public async getRandomUsers(): Promise<UserDto[]> {
    const cachedUsers: UserDocument[] =
      await this.userCacheService.getRandomUsers();

    const users: UserDocument[] = cachedUsers
      ? cachedUsers
      : await this.userRepository.getRandomUsers();

    return users.map((user) => new UserDto(user));
  }

  public async searchUser(query: string): Promise<SearchUserDto[]> {
    const regexp = new RegExp(escapeRegexp(query));
    return await this.authService.searchUsers(regexp);
  }
}
