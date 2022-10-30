import { Controller, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { ID } from '@/shared/interfaces/types';
import { BlockUserService } from '@/block-user/block-user.service';

@ApiTags('Block user')
@Controller('user')
export class BlockUserController {
  constructor(private readonly blockUserService: BlockUserService) {}

  @Put('block/:followerId')
  public block(@Param('followerId', ValidateIdPipe) followerId: ID) {
    return followerId;
  }
}
