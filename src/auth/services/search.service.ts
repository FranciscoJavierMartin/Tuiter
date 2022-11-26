import { Injectable } from '@nestjs/common';
import { SearchUserDto } from '@/user/dto/responses/search-user.dto';
import { AuthRepository } from '@/auth/repositories/auth.repository';

@Injectable()
export class SearchService {
  constructor(private readonly authRepository: AuthRepository) {}

  /**
   * Search users with given username match
   * @param regexp Regular expression to match username
   * @returns User list that match regexp
   */
  public async searchUsers(regexp: RegExp): Promise<SearchUserDto[]> {
    return this.authRepository.searchUsers(regexp);
  }
}
