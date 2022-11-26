import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { ID } from '@/shared/interfaces/types';
import { UserService } from '@/user/services/user.service';
import { UserDto } from '@/user/dto/responses/user.dto';
import { SearchUserDto } from './dto/responses/search-user.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search/:query')
  @ApiParam({
    name: 'query',
    description: 'Criteria to search',
  })
  @ApiOkResponse({
    description: 'User list with match with query param',
    isArray: true,
    type: [SearchUserDto],
  })
  public async searchUser(
    @Param('query') query: string,
  ): Promise<SearchUserDto[]> {
    return this.userService.searchUser(query);
  }

  // TODO: Get user is is authenticated (Interceptor or middleware)
  @Get('profile/suggestions')
  @ApiOkResponse({
    description: 'Random users',
    isArray: true,
    type: [UserDto],
  })
  public async getRandomUsers(): Promise<UserDto[]> {
    return this.userService.getRandomUsers();
  }

  @Get('profile/:userId')
  @ApiParam({
    name: 'userId',
    description: 'User id',
  })
  @ApiOkResponse({
    description: 'User profile',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  public async getProfileByUserId(
    @Param('userId', ValidateIdPipe) userId: ID,
  ): Promise<UserDto> {
    return this.userService.getProfileByUserId(userId);
  }

  @Patch('profile/user-info')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  public async updateUserInfo() {
    return 'test';
  }
}
