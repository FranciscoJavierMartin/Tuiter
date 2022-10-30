import { Controller, Put } from '@nestjs/common';
import { BlockUserService } from '@/block-user/block-user.service';

@Controller('block-user')
export class BlockUserController {
  constructor(private readonly blockUserService: BlockUserService) {}

  @Put()
  block() {
    return 'block user';
  }
}
