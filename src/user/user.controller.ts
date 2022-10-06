import { Controller } from '@nestjs/common';
import { UserService } from '@/user/services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
