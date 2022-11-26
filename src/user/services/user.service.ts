import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { escapeRegexp, removeUndefinedAttributes } from '@/helpers/utils';
import { ID } from '@/shared/interfaces/types';
import { SearchService } from '@/auth/services/search.service';
import { AuthDocument } from '@/auth/models/auth.model';
import { UserDocument } from '@/user/models/user.model';
import { UserRepository } from '@/user/repositories/user.repository';
import { UserCacheService } from '@/user/services/user.cache.service';
import { UserInfoDto } from '@/user/dto/requests/user-info.dto';
import { SocialLinksDto } from '@/user/dto/requests/social-links.dto';
import { UserDto } from '@/user/dto/responses/user.dto';
import { SearchUserDto } from '@/user/dto/responses/search-user.dto';
import { SocialLinks, UserJobData } from '@/user/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly searchService: SearchService,
    private readonly userRepository: UserRepository,
    private readonly userCacheService: UserCacheService,
    @InjectQueue('user')
    private readonly userQueue: Queue<UserJobData>,
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

  /**
   * Update user info
   * @param userId User id
   * @param userInfoDto User data to be updated
   */
  public async updateUserInfo(
    userId: ID,
    userInfoDto: UserInfoDto,
  ): Promise<void> {
    // TODO: Check if this could be reused to updated other models
    const userInfo: UserInfoDto = removeUndefinedAttributes(userInfoDto);

    for (const [attribute, value] of Object.entries(userInfo)) {
      await this.userCacheService.updateUserAttributeInCache(
        userId,
        attribute,
        value,
      );
    }

    this.userQueue.add('updateUserInDB', {
      userId,
      data: userInfo,
    });
  }

  /**
   * Update social links
   * @param userId User id
   * @param socialLinksDto social links to update
   */
  public async updateSocialLinks(
    userId: ID,
    socialLinksDto: SocialLinksDto,
  ): Promise<void> {
    const socialLinks: SocialLinksDto =
      removeUndefinedAttributes(socialLinksDto);
    await this.userCacheService.updateSocialLinksInCache(userId, socialLinks);

    this.userQueue.add('updateSocialLinksInDB', {
      userId,
      socialLinks: socialLinks as unknown as SocialLinks,
    });
  }
}
