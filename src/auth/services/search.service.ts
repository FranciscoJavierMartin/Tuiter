import { Injectable } from '@nestjs/common';
import { AuthRepository } from '@/auth/repositories/auth.repository';
import { SearchUserDto } from '@/user/dto/responses/search-user.dto';

@Injectable()
export class SearchService {
  constructor(private readonly authRepository: AuthRepository) {}

  public async searchUsers(regexp: RegExp): Promise<SearchUserDto[]> {
    return this.authRepository.searchUsers(regexp);
  }
}
