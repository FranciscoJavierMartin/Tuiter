import { Controller } from '@nestjs/common';
import { UserService } from '@/user/services/user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
