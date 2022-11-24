import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { ID } from '@/shared/interfaces/types';
import { UserService } from '@/user/services/user.service';
import { UserDto } from '@/user/dto/responses/user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
