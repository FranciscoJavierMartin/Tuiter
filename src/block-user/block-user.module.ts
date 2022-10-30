import { Module } from '@nestjs/common';
import { BlockUserService } from '@/block-user/block-user.service';
import { BlockUserController } from '@/block-user/block-user.controller';

@Module({
  controllers: [BlockUserController],
  providers: [BlockUserService],
})
export class BlockUserModule {}
