import { Injectable } from '@nestjs/common';
import { escapeRegexp } from '@/helpers/utils';
import { ID } from '@/shared/interfaces/types';
import { SearchService } from '@/auth/services/search.service';
import { AuthDocument } from '@/auth/models/auth.model';
import { UserDocument } from '@/user/models/user.model';
import { UserRepository } from '@/user/repositories/user.repository';
import { UserCacheService } from '@/user/services/user.cache.service';
import { UserInfoDto } from '@/user/dto/requests/user-info.dto';
import { UserDto } from '@/user/dto/responses/user.dto';
import { SearchUserDto } from '@/user/dto/responses/search-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly searchService: SearchService,
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

  /**
   * Retrieve users that match with given query
   * @param query Username pattern to match
   * @returns User list
   */
  public async searchUser(query: string): Promise<SearchUserDto[]> {
    const regexp = new RegExp(escapeRegexp(query), 'i');
    return await this.searchService.searchUsers(regexp);
  }

  public async updateUserInfo(
    userId: ID,
    userInfoDto: UserInfoDto,
  ): Promise<void> {
    for (const [attribute, value] of Object.entries(userInfoDto)) {
      if (value) {
        await this.userCacheService.updateUserAttributeInCache(
          userId,
          attribute,
          value,
        );
      }
    }
  }
}
